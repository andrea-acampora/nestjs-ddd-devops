import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiRole } from '../../../../libs/api/api-role.enum';
import { AuthRoles } from '../../../../libs/decorator/auth.decorator';
import { CreateUserBody } from '../body/create-user.body';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/command/create-user.command';
import { UserRole } from '../../domain/value-object/user-role.enum';
import { getOrThrowWith } from 'effect/Option';

@Controller('users')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthRoles(ApiRole.ADMIN)
  @Post()
  async createUser(@Body() body: CreateUserBody) {
    getOrThrowWith(
      await this.commandBus.execute(
        this.getCommandForRole(body, UserRole.USER),
      ),
      () => new BadRequestException('Error in User Creation'),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthRoles(ApiRole.ADMIN)
  @Post('/admin')
  async createAdminUser(@Body() body: CreateUserBody) {
    getOrThrowWith(
      await this.commandBus.execute(
        this.getCommandForRole(body, UserRole.ADMIN),
      ),
      () => new BadRequestException('Error in Admin Creation'),
    );
  }

  /**
   *  Helper function to get the CQRS command depending on User role.
   */
  getCommandForRole = (
    body: CreateUserBody,
    role: UserRole,
  ): CreateUserCommand => {
    return new CreateUserCommand(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      role,
    );
  };
}
