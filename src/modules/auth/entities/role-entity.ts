import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleTypes } from '../../../common/constants';

@Entity({ name: 'roles' })
export class RoleEntity {

  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'name', type: 'enum', enum: RoleTypes })
  name: RoleTypes;

}
