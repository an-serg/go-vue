export function verificationEmail(link: string): { subject: string; html: string; text: string } {
  const subject = 'Подтвердите почту — BookTook';

  const text =
    `Спасибо за регистрацию в BookTook!\n\n` +
    `Подтвердите почту, перейдя по ссылке:\n${link}\n\n` +
    `Ссылка действует 24 часа. Если вы не регистрировались — проигнорируйте это письмо.`;

  const html = `<!DOCTYPE html>
    <html lang="ru">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтвердите почту</title>
    </head>
    <body style="margin:0; padding:0; background-color:#DDDFC2; font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#DDDFC2; padding:32px 16px;">
        <tr>
        <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid rgba(148,165,156,0.25);">
            <tr>
                <td style="background-color:#2C341B; padding:24px 32px; text-align:center;">
                <span style="font-size:22px; font-weight:bold; color:#DDDFC2; letter-spacing:0.5px;">📚 BookTook</span>
                </td>
            </tr>
            <tr>
                <td style="padding:32px;">
                <h1 style="margin:0 0 12px; font-size:22px; color:#2C341B;">Подтвердите почту</h1>
                <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:rgba(44,52,27,0.75);">
                    Спасибо за регистрацию в BookTook! Остался один шаг — подтвердите, что это ваша почта, и добро пожаловать к книгам.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                    <td align="center" style="border-radius:12px; background-color:#688A65;">
                        <a href="${link}" style="display:inline-block; padding:14px 32px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:12px;">
                        Подтвердить почту
                        </a>
                    </td>
                    </tr>
                </table>
                <p style="margin:24px 0 0; font-size:13px; line-height:1.6; color:#94A59C;">
                    Если кнопка не работает, скопируйте ссылку в браузер:<br>
                    <a href="${link}" style="color:#688A65; word-break:break-all;">${link}</a>
                </p>
                </td>
            </tr>
            <tr>
                <td style="padding:20px 32px; border-top:1px solid rgba(148,165,156,0.25); text-align:center;">
                <p style="margin:0; font-size:12px; color:#94A59C; line-height:1.5;">
                    Ссылка действует 24 часа. Если вы не регистрировались в BookTook — проигнорируйте это письмо.
                </p>
                </td>
            </tr>
            </table>
            <p style="margin:16px 0 0; font-size:12px; color:#94A59C;">BookTook — потому что книги выбирают нас 🦉</p>
        </td>
        </tr>
    </table>
    </body>
    </html>`;

  return { subject, html, text };
}