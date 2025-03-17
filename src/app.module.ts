import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './config/database/mikro-orm.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommunicationModule } from './modules/communication/communication.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    HttpModule,
    CqrsModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          ...mikroOrmConfig,
          allowGlobalContext: true,
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: '100_CALL_PER_MINUTE',
        ttl: 60000,
        limit: 100,
      },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    HealthModule,
    UserModule,
    AuthModule,
    CommunicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
