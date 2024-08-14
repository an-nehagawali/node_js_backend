import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
interface EmailTemplateData {
  [key: string]: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS,
      },
    });
  }

  public async sendEmail(to: string, subject: string, templateName: string, templateData: EmailTemplateData): Promise<void> {
    try {
      const html = await this.getEmailTemplate(templateName, templateData);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email', error);
      throw error;
    }
  }

  private async getEmailTemplate(templateName: string, data: EmailTemplateData): Promise<string> {
    const templatePath = path.join(__dirname, `../../uploads/template/${templateName}`);
    let template = fs.readFileSync(templatePath, 'utf-8');
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{ ${key} }}`;
      template = template.replace(new RegExp(placeholder, 'g'), value);
    }
    return template;
  }
}
