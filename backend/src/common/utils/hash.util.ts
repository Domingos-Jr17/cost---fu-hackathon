import * as crypto from 'crypto';

export class HashUtil {
  /**
   * Hash phone number using SHA256 for privacy
   */
  static hashPhone(phone: string): string {
    if (!phone) return null;

    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');

    return crypto.createHash('sha256').update(normalizedPhone).digest('hex');
  }

  /**
   * Hash IP address for rate limiting
   */
  static hashIp(ip: string): string {
    if (!ip) return null;

    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  /**
   * Generate unique session ID for USSD
   */
  static generateSessionId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generate unique report ID
   */
  static generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}