import { Workspace } from '../../workspaces/entities/workspace.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Workspace, workspace => workspace.taskLists)
  workspace: Workspace;

  @OneToMany(() => Task, task => task.taskList)
  tasks: Task[];
}
