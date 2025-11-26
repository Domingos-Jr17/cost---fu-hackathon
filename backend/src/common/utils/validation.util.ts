/**
 * Utilitários de validação para dados moçambicanos
 */

export const isValidMozambiquePhone = (phone: string): boolean => {
  if (!phone) return false;

  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Mozambique phone patterns
  const patterns = [
    /^2588[2-7]\d{7}$/, // +258 8X XXX XXXX (mobile)
    /^8[2-7]\d{7}$/,     // 8X XXX XXXX (mobile)
    /^2582\d{8}$/,       // +258 2XX XXX XXX (landline)
    /^2\d{8}$/,          // 2XX XXX XXX (landline)
  ];

  return patterns.some(pattern => pattern.test(cleaned));
};

export const isValidProjectId = (id: string): boolean => {
  if (!id) return false;

  // Project ID validation (alphanumeric, dash, underscore, 1-50 chars)
  const pattern = /^[a-zA-Z0-9\-_]{1,50}$/;
  return pattern.test(id);
};

export const sanitizeDescription = (text: string, maxLength: number = 1000): string => {
  if (!text) return '';

  return text
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, maxLength);
};

export const sanitizeName = (name: string, maxLength: number = 100): string => {
  if (!name) return '';

  return name
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>\"'&]/g, '') // Remove dangerous characters
    .substring(0, maxLength);
};

export const validateCoordinates = (lat: number, lng: number): boolean => {
  // Mozambique approximate bounds
  const latMin = -26.8685;
  const latMax = -10.4730;
  const lngMin = 30.2165;
  const lngMax = 40.8425;

  return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
};

export const validateImageFormat = (filename: string): boolean => {
  if (!filename) return false;

  const allowedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

  return allowedFormats.includes(extension);
};

export const validateFileSize = (size: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const generateReportId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `report_${timestamp}_${random}`;
};

export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `session_${timestamp}_${random}`;
};

export const hashPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Simple hash for privacy (in production, use proper crypto)
  let hash = 0;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
};

export const validateReportType = (type: string): boolean => {
  const validTypes = ['atraso', 'qualidade', 'corrupcao', 'outro'];
  return validTypes.includes(type);
};

export const validateReportSource = (source: string): boolean => {
  const validSources = ['pwa', 'ussd'];
  return validSources.includes(source);
};