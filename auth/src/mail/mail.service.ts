import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { verificationEmail } from './templates/verification.template';

@Injectable()
export class MailService {
  async sendVerification(to: string, link: string): Promise<void> {
    const { subject, html, text } = verificationEmail(link);

    const response = await fetch(
      `https://api.rusender.ru/api/v1/external-mails/send/${process.env.RUSENDER_KEY_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RUSENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idempotencyKey: randomUUID(),
          mail: {
            to: { email: to },
            from: { email: process.env.MAIL_FROM, name: 'BookTook' },
            subject,
            html,
            text,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`RuSender API ${response.status}: ${await response.text()}`);
    }
  }
}