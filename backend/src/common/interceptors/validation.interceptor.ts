import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { validateMozambiquePhone, sanitizeDescription } from '../utils/validation.util';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Log de request para debugging
    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    const userAgent = request.get('User-Agent') || 'Unknown';

    console.log(`[${new Date().toISOString()}] ${method} ${url} - UA: ${userAgent}`);

    // Validação específica para endpoints de relatos
    if (url.includes('/reports') && method === 'POST') {
      const body = request.body;

      // Validação de telefone moçambicano
      if (body.phone && !validateMozambiquePhone(body.phone)) {
        console.warn(`Invalid phone number: ${body.phone} from IP: ${request.ip}`);
        throw new BadRequestException('Número de telefone moçambicano inválido');
      }

      // Validação de descrição
      if (body.description) {
        const sanitized = sanitizeDescription(body.description, 1000);
        if (sanitized.length !== body.description.length) {
          console.warn(`Description sanitized for report from IP: ${request.ip}`);
          body.description = sanitized;
        }
      }

      // Validação de coordenadas (se existirem)
      if (body.location?.lat && body.location?.lng) {
        const lat = parseFloat(body.location.lat);
        const lng = parseFloat(body.location.lng);

        // Mozambique bounds
        if (lat < -26.8685 || lat > -10.4730 || lng < 30.2165 || lng > 40.8425) {
          console.warn(`Invalid coordinates: ${lat}, ${lng} from IP: ${request.ip}`);
          throw new BadRequestException('Coordenadas geográficas inválidas para Moçambique');
        }
      }
    }

    return next.handle().pipe(
      catchError(error => {
        const duration = Date.now() - startTime;
        console.error(`[${new Date().toISOString()}] ERROR ${method} ${url} - ${duration}ms - ${error.message}`);

        // Log específico para rate limiting
        if (error.status === 429) {
          console.warn(`Rate limit exceeded for IP: ${request.ip}`);
        }

        return throwError(() => error);
      })
    );
  }
}