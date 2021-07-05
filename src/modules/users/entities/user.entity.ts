import { UserWorkspaces } from '../../workspaces/entities/userWorkspaces.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserWorkspaces, userWorkspaces => userWorkspaces.user)
  userWorkspaces!: UserWorkspaces;

  @ManyToMany(() => Task, task => task.users)
  @JoinTable()
  tasks: Task[];
}
