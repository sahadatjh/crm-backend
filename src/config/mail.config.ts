import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
  user: process.env.MAIL_USER?.trim(),
  password: process.env.MAIL_PASS?.trim(), // key in .env is MAIL_PASS
  fromName: process.env.MAIL_FROM_NAME || 'CRM System',
  fromEmail: process.env.MAIL_FROM_EMAIL || 'noreply@crm.com',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
