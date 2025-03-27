import { CreatedUserEvent } from '../../../../user/domain/event/created-user.event';
import { EventsHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { EmailService } from '../../service/email.service.interface';
import { EMAIL_SERVICE } from '../../../communication.tokens';

@EventsHandler(CreatedUserEvent)
@Injectable()
export class CreatedUserHandler {
  constructor(
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {}

  async handle(event: CreatedUserEvent): Promise<void> {
    await this.emailService.sendWelcomeEmail(event.payload.props.email);
  }
}
