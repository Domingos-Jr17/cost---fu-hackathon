import { Controller, Get, Post, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { ReportsService } from './reports.service';
import { CreateReportDto, ReportResponseDto, GetReportsDto, ReportsResponseDto } from './dto';

/**
 * Reports Controller - REST API for citizen reports
 */
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo relato sobre projeto',
    description: 'Cria um novo relato com foto opcional e localização. Protege privacidade com hash do número de telefone e implementa rate limiting.',
  })
  @ApiResponse({
    status: 201,
    description: 'Relato criado com sucesso',
    type: ReportResponseDto,
  })
  async createReport(
    @Body() createReportDto: CreateReportDto,
    ipHash: string,
  ): Promise<ReportResponseDto> {
    return this.reportsService.createReport(createReportDto, ipHash);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar relatos sobre projetos',
    description: 'Lista todos os relatos com filtros opcionais de projeto, status, tipo e data. Retorna relatos paginados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de relatos retornada com sucesso',
    type: ReportsResponseDto,
  })
  async getReports(
    @Query() filters: GetReportsDto,
    ): Promise<ReportsResponseDto> {
    return this.reportsService.getReports(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter detalhes do relato',
    description: 'Retorna informações detalhadas de um relato específico pelo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do relato retornados com sucesso',
    type: Object,
  })
  async getReportById(
    @Param('id') id: string,
  ): Promise<any> {
    return this.reportsService.getReportById(id);
  }
}