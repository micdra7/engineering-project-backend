import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskList } from './taskList.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  finishDate?: Date;

  @Column({ nullable: true })
  isDeleted?: boolean;

  // only used if object is a subtask
  @Column({ nullable: true })
  isDone?: boolean;

  @ManyToOne(() => Task, task => task.childrenTasks)
  parentTask?: Task;

  @OneToMany(() => Task, task => task.parentTask)
  childrenTasks?: Task[];

  @ManyToMany(() => User, user => user.tasks)
  users?: User[];

  @ManyToOne(() => TaskList, taskList => taskList.tasks)
  taskList: TaskList;
}
