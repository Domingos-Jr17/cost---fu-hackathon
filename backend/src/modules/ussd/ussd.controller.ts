import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus, BadRequestException, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HashUtil } from '../../common/utils/hash.util';

import { UssdService } from './ussd.service';
import { UssdRequestDto, UssdResponseDto } from './dto';

/**
 * USSD Controller - REST API for USSD interactions
 */
@ApiTags('ussd')
@Controller('ussd')
export class UssdController {
  private readonly logger = console; // In real app, use Logger from NestJS

  constructor(private readonly ussdService: UssdService) {}

  @Post('incoming')
  @ApiOperation({
    summary: 'Process USSD request from basic phone',
    description: 'Handles incoming USSD requests for project browsing and reporting. Supports stateless sessions with unique IDs.',
  })
  @ApiResponse({
    status: 200,
    description: 'USSD request processed successfully',
    type: UssdResponseDto,
  })
  async incoming(
    @Body() request: UssdRequestDto,
    @Request() req: any,
  ): Promise<UssdResponseDto> {
    try {
      // Get IP address from request and hash it
      const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress ||
                 (req.connection as any).remoteAddress;
      const ipHash = ip ? HashUtil.hashIp(ip) : 'unknown_ip';

      // In real implementation, this would extract from telecom gateway
      let phoneHash: string | null = null;
      if (request.phoneNumber && typeof request.phoneNumber === 'string') {
        phoneHash = HashUtil.hashPhone(request.phoneNumber);
      }

      return await this.ussdService.processUssdRequest(request, ipHash);
    } catch (error) {
      this.logger.error('Error processing USSD request:', error);

      // Fallback response for testing
      return {
        text: 'Erro ao processar requisição USSD. Tente novamente.',
        continue: false,
        sessionId: request.sessionId || this.ussdService.generateSessionId(),
        currentStep: 'main',
      };
    }
  }

  @Get('simulator')
  @ApiOperation({
    summary: 'Get USSD simulator interface',
    description: 'Returns web interface for USSD testing and simulation.',
  })
  @ApiResponse({
    status: 200,
    description: 'USSD simulator interface loaded successfully',
    schema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' },
        initialMessage: { type: 'string' }
      }
    },
  })
  async getSimulator(): Promise<{
    sessionId: string;
    initialMessage: string;
  }> {
    try {
      // Generate session for simulator
      const sessionId = this.ussdService.generateSessionId();

      // Get USSD code from environment
      const ussdCode = this.ussdService.getUssdCode();

      return {
        sessionId,
        initialMessage: `Bem-vindo ao simulador USSD do Costant!\n\nDigite *${ussdCode}# para começar.`,
      };
    } catch (error) {
      this.logger.error('Error getting USSD simulator:', error);

      throw new BadRequestException('Erro ao carregar simulador USSD');
    }
  }
}