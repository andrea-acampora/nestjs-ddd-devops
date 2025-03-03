import { Module } from '@nestjs/common';
import { CreatedUserHandler } from './application/handler/event/created-user.handler';
import { EMAIL_SERVICE } from './communication.tokens';
import { EmailServiceImpl } from './infrastructure/email/email.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CreatedUserHandler,
    {
      provide: EMAIL_SERVICE,
      useClass: EmailServiceImpl,
    },
  ],
  exports: [],
})
export class CommunicationModule {}
