import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workspace } from './workspace.entity';
import { Role } from './role.enum';

@Entity()
export class UserWorkspaces {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  role: Role;

  @Column()
  workspaceId!: number;

  @ManyToOne(() => User, user => user.userWorkspaces)
  user!: User;

  @ManyToOne(() => Workspace, workspace => workspace.userWorkspaces)
  workspace!: Workspace;
}
