import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RoleTypes } from '../../../common/constants';

import { AuthUser } from '../../../decorators/auth-user.decorator';
import { ParamEntity } from '../../../decorators/param-entity.decorator';
import { Roles } from '../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { EmailAlreadyInUseError } from '../../auth/errors';
import { CreateUserDto, SetRoleDto, UpdateUserDto, UserPageDto, UsersPageDto, UsersPageOptionsDto } from '../dto';
import { UserEntity } from '../entities';
import { UserService } from '../services';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('/')
  @Roles(RoleTypes.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new user',
    type: UserPageDto,
  })
  async createNew(@Body() body: CreateUserDto): Promise<UserPageDto> {
    if (await this.userService.findOneByEmail(body.email)) {
      throw new EmailAlreadyInUseError();
    }
    const user = await this.userService.createUser(body);
    return new UserPageDto(user.toDto());
  }

  @Get('/')
  @Roles(RoleTypes.PLAYER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UsersPageDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async listAll(
    @Query(new ValidationPipe({ transform: true }))
      pageOptionsDto: UsersPageOptionsDto,
  ): Promise<UsersPageDto> {
    const [ data, total ] = await this.userService.findMany(pageOptionsDto);

    return new UsersPageDto(data.map(u => u.toDto()), { total });
  }

  @Get('/:user')
  @Roles(RoleTypes.PLAYER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get specific user info',
    type: UserPageDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOne(
    @ParamEntity('user', UserEntity) user: UserEntity,
  ) {
    return new UserPageDto(user.toDto());
  }

  @Put('/:user')
  @Roles(RoleTypes.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update specific user',
    type: UsersPageDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateOne(
    @ParamEntity('user', UserEntity) user: UserEntity,
    @Body() dto: UpdateUserDto,
  ) {
    const updated = await this.userService.updateUser(user, dto);
    return new UserPageDto(updated.toDto());
  }

  @Delete('/:user')
  @Roles(RoleTypes.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete specific user',
    type: UsersPageDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeOne(
    @ParamEntity('user', UserEntity) user: UserEntity,
  ) {
    await this.userService.removeUser(user);
  }

  @Get('/self')
  @Roles(RoleTypes.PLAYER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get current user info',
    type: UserPageDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSelf(@AuthUser() user: UserEntity) {
    return new UserPageDto(user.toDto());
  }

  @Patch('/self')
  @Roles(RoleTypes.PLAYER)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update current user info',
    type: UserPageDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateSelf(
    @AuthUser() user: UserEntity,
    @Body() dto: UpdateUserDto,
  ) {
    const updated = await this.userService.updateUser(user, dto);
    return new UserPageDto(updated.toDto());
  }

  @Patch('/:user/role')
  @Roles(RoleTypes.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Change role for specific user',
    type: UsersPageDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  setRole(
    @ParamEntity('user', UserEntity) user: UserEntity,
    @Body() dto: SetRoleDto,
  ) {
    return this.userService.setUserRole(user, dto.role);
  }
}
