import { Injectable, Logger, ConflictException, BadRequestException, NotFoundException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashUtil } from '../../common/utils/hash.util';
import { CreateReportDto, ReportResponseDto, GetReportsDto, ReportsResponseDto } from './dto';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('Reports Service initialized with Prisma');
  }

  async createReport(createReportDto: CreateReportDto, ipHash: string): Promise<ReportResponseDto> {
    try {
      const prisma = this.prismaService.client;

      // Hash phone number for privacy
      const phoneHash = createReportDto.phone
        ? HashUtil.hashPhone(createReportDto.phone)
        : null;

      // Check rate limiting (3 reports per phone per day)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const reportsToday = await prisma.report.count({
        where: {
          phone_hash: phoneHash ? phoneHash : undefined,
          created_at: {
            gte: todayStart,
            lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
          },
        },
      });

      if (reportsToday >= 3) {
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

      // Create report with Prisma
      const savedReport = await prisma.report.create({
        data: {
          id: reportId,
          project_id: createReportDto.projectId,
          phone_hash: phoneHash || undefined,
          ip_hash: ipHash,
          type: createReportDto.type,
          description: createReportDto.description,
          photo_url: photoUrl,
          location: createReportDto.location ? JSON.parse(JSON.stringify(createReportDto.location)) : undefined,
          status: 'pendente',
          source: createReportDto.source,
          score,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      this.logger.log(`Report created successfully: ${reportId}`);

      return {
        reportId,
        message: 'Relato criado com sucesso! Agradecemos sua participação na fiscalização.',
      };
    } catch (error) {
      this.logger.error('Error creating report:', error);
      if (error.code === 'P2002') {
        throw new ConflictException('Relato duplicado detectado.');
      }
      throw new BadRequestException('Erro ao criar relato. Tente novamente.');
    }
  }

  async getReports(filters: GetReportsDto = {}): Promise<ReportsResponseDto> {
    try {
      const prisma = this.prismaService.client;

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

      // Date filtering for Prisma
      if (filters.startDate && filters.endDate) {
        where.created_at = {
          gte: new Date(filters.startDate),
          lt: new Date(filters.endDate)
        };
      } else if (filters.startDate) {
        where.created_at = {
          gte: new Date(filters.startDate)
        };
      } else if (filters.endDate) {
        where.created_at = {
          lt: new Date(filters.endDate)
        };
      }

      // Get reports with pagination with default values
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const skip = (page - 1) * limit;

      const [total, reports] = await prisma.$transaction([
        prisma.report.count({ where }),
        prisma.report.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip,
          take: limit,
        }),
      ]);

      return {
        reports,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error getting reports:', error);
      throw new BadRequestException('Erro ao buscar relatos.');
    }
  }

  async getReportById(id: string): Promise<any> {
    try {
      const prisma = this.prismaService.client;
      const report = await prisma.report.findUnique({
        where: { id },
      });

      if (!report) {
        throw new NotFoundException('Relato não encontrado.');
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

  private calculateScore(createReportDto: CreateReportDto): number {
    let score = 0;

    // Photo evidence (+2 points)
    if (createReportDto.photoUrl) {
      score += 2;
    }

    // Detailed description (+1 point)
    if (createReportDto.description && createReportDto.description.length > 50) {
      score += 1;
    }

    // Geolocation proximity (+3 points)
    if (createReportDto.location && createReportDto.location.lat && createReportDto.location.lng) {
      score += 3;
    }

    return score;
  }
}
