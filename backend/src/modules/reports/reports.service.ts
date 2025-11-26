import { Injectable, Logger, HttpStatus, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DatabaseConfig } from '../../config/database.config';
import { HashUtil } from '../../common/utils/hash.util';

import { CreateReportDto, ReportResponseDto } from './dto';
import { GetReportsDto, ReportsResponseDto } from './dto';

interface ReportEntity {
  id: string;
  project_id: string;
  phone_hash: string;
  ip_hash: string;
  type: string;
  description: string;
  photo_url?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: string;
  source: string;
  score: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Reports Service - Handles citizen reports with privacy and moderation
 */
@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportsRepository: Repository<ReportEntity>,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('Reports Service initialized');
  }

  /**
   * Create a new citizen report
   */
  async createReport(createReportDto: CreateReportDto, ipHash: string): Promise<ReportResponseDto> {
    try {
      // Hash phone number for privacy
      const phoneHash = createReportDto.phone
        ? HashUtil.hashPhone(createReportDto.phone)
        : null;

      // Check rate limiting (3 reports per phone per day)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const reportsToday = await this.reportsRepository.find({
        where: {
          phone_hash: phoneHash,
          created_at: {
            $gte: todayStart,
          $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      if (reportsToday.length >= 3) {
        this.logger.warn(`Rate limit exceeded for phone ${createReportDto.phone}`);
        throw new BadRequestException('Limite de 3 relatos por dia excedido. Tente novamente amanhã.');
      }

      // Generate unique report ID
      const reportId = HashUtil.generateReportId();

      // Handle file upload
      let photoUrl: string | undefined;
      if (createReportDto.photoUrl) {
        // In real implementation, this would save to storage
        photoUrl = `/uploads/${reportId}_photo.jpg`;
        this.logger.log(`Photo saved: ${photoUrl}`);
      }

      // Score calculation for automatic moderation
      const score = this.calculateScore(createReportDto);

      // Create report entity
      const report: Partial<ReportEntity> = {
        id: reportId,
        project_id: createReportDto.projectId,
        phone_hash: phoneHash,
        ip_hash: ipHash,
        type: createReportDto.type,
        description: createReportDto.description,
        photo_url: photoUrl,
        location: createReportDto.location || null,
        status: 'pendente',
        source: createReportDto.source,
        score,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Save to database (in production, this would be Supabase)
      const savedReport = await this.reportsRepository.save(report);

      this.logger.log(`Report created successfully: ${reportId}`);

      return {
        reportId,
        message: 'Relato criado com sucesso! Agradecemos sua participação na fiscalização.',
      };
    } catch (error) {
      this.logger.error('Error creating report:', error);

      if (error.code === '23505') {
        throw new ConflictException('Relato duplicado detectado.');
      }

      throw new BadRequestException('Erro ao criar relato. Tente novamente.');
    }
  }

  /**
   * Get all reports with filters
   */
  async getReports(filters: GetReportsDto = {}): Promise<ReportsResponseDto> {
    try {
      const where: any = {};

      // Apply filters
      if (filters.projectId) {
        where.project_id = filters.projectId;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.type) {
        where.type = filters.type;
      }

      if (filters.startDate) {
        where.created_at = {
          $gte: filters.startDate,
        };
      }

      if (filters.endDate) {
        where.created_at = {
          $lte: filters.endDate,
        };
      }

      // Get reports with pagination
      const [reports, total] = await this.reportsRepository.findAndCount({
        where,
        order: {
          created_at: 'DESC',
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      });

      // Sort by creation date (newest first)
      const sortedReports = reports.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return {
        reports: sortedReports,
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      };
    } catch (error) {
      this.logger.error('Error getting reports:', error);

      throw new BadRequestException('Erro ao buscar relatos.');
    }
  }

  /**
   * Get single report by ID
   */
  async getReportById(id: string): Promise<any> {
    try {
      const report = await this.reportsRepository.findOne({ where: { id } });

      if (!report) {
        throw new BadRequestException('Relato não encontrado.');
      }

      // Remove sensitive data for API response
      const { phone_hash, ip_hash, ...sanitizedReport } = report;

      return {
        id: report.id,
        project_id: report.project_id,
        type: report.type,
        description: report.description,
        photo_url: report.photo_url,
        location: report.location,
        status: report.status,
        source: report.source,
        score: report.score,
        created_at: report.created_at,
        updated_at: report.updated_at,
      };
    } catch (error) {
      this.logger.error(`Error getting report ${id}:`, error);

      throw new BadRequestException('Erro ao buscar relato.');
    }
  }

  /**
   * Update report status (for moderation)
   */
  async updateReportStatus(id: string, status: 'verificado' | 'resolvido' | 'spam'): Promise<void> {
    try {
      const report = await this.reportsRepository.findOne({ where: { id } });

      if (!report) {
        throw new BadRequestException('Relato não encontrado.');
      }

      await this.reportsRepository.update(id, {
        status,
        updated_at: new Date(),
      });

      this.logger.log(`Report ${id} updated to ${status}`);

      return;
    } catch (error) {
      this.logger.error(`Error updating report ${id}:`, error);

      throw new BadRequestException('Erro ao atualizar relato.');
    }
  }

  /**
   * Calculate moderation score
   */
  private calculateScore(report: CreateReportDto): number {
    let score = 0;

    // Photo evidence (+2 points)
    if (report.photoUrl) {
      score += 2;
    }

    // Detailed description (+1 point)
    if (report.description && report.description.length > 50) {
      score += 1;
    }

    // Geolocation proximity (+3 points)
    if (report.location && report.location.lat && report.location.lng) {
      // In real implementation, this would check proximity to project location
      score += 3;
    }

    return score;
  }

  /**
   * Clean up expired USSD sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    try {
      // In production, this would use Supabase
      const expiredSessions = await this.reportsRepository.query(
        `DELETE FROM ussd_sessions WHERE expires_at < NOW()`
      );

      this.logger.log(`Cleaned up ${expiredSessions.affected || 0} expired USSD sessions`);
    } catch (error) {
      this.logger.error('Error cleaning up USSD sessions:', error);
    }
  }
}