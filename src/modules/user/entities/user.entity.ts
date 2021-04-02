import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/constants';
import { PasswordTransformer } from '../../../transformers';
import { RoleEntity } from '../../auth/entities';
import { UserDto } from '../dto';

@Entity({ name: 'users', orderBy: { createdAt: 'DESC' } })
export class UserEntity extends AbstractEntity<UserDto> {

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'about', type: 'varchar' })
  about: string;

  @Column({ name: 'avatar', type: 'varchar' })
  avatar: string;

  @Column({ name: 'email', type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ name: 'password_hash', nullable: false, transformer: new PasswordTransformer() })
  password: string;

  dtoClass = UserDto;
}
