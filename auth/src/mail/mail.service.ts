import { Injectable } from '@nestjs/common';
import { verificationEmail } from './templates/verification.template';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  async sendVerification(to: string, link: string): Promise<void> {
    const { subject, html, text } = verificationEmail(link);
    await this.transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html, text });
  }
}