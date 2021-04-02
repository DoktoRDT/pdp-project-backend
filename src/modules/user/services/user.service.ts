import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleTypes } from '../../../common/constants';
import { UtilsService } from '../../../providers/utils.service';
import { RoleEntity } from '../../auth/entities';
import { CreateUserDto, UpdateUserDto, UsersPageOptionsDto } from '../dto';
import { UserEntity } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
  }

  findOne(id: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne(id);
  }

  findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ email });
  }

  findMany(options: UsersPageOptionsDto): Promise<[ UserEntity[], number ]> {
    return this.usersRepository.findAndCount({
      skip: options.skip,
      take: options.take,
    });
  }

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const role = await this.roleRepository.findOne({ name: dto.role });
    const user = this.usersRepository.create({
      ...dto,
      role,
    });
    return this.usersRepository.save(user);
  }

  async updateUser(user: UserEntity, dto: UpdateUserDto): Promise<UserEntity> {
    await this.usersRepository.update(user.id, dto);
    return this.usersRepository.findOne(user.id);
  }

  async removeUser(user: UserEntity): Promise<void> {
    await this.usersRepository.remove(user);
  }

  async setUserRole(user: UserEntity, roleName: RoleTypes): Promise<UserEntity> {
    const role = await this.roleRepository.findOne({ name: roleName });
    await this.usersRepository.update(user.id, { role });
    return this.usersRepository.findOne(user.id);
  }
}
