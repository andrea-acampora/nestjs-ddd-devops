import { EmailService } from '../../application/service/email.service.interface';

/**
 * Contains the implementation of the Email Service interface.
 * It can use a specific package like NodeMailer or MailGun.
 */
export class EmailServiceImpl implements EmailService {
  constructor() {}
  async sendWelcomeEmail(email: string): Promise<void> {
    console.log(`Sending email to ${email}`);
  }
}
