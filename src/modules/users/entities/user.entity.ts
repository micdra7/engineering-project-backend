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
import { Call } from '../../calls/entities/call.entity';
import { UserChatrooms } from '../../chatrooms/entities/userChatrooms.entity';
import { Message } from '../../chatrooms/entities/message.entity';
import { GameResult } from '../../games/entities/gameResult.entity';

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

  @OneToMany(() => UserChatrooms, userChatrooms => userChatrooms.user)
  userChatrooms!: UserChatrooms;

  @OneToMany(() => GameResult, gameResult => gameResult.user)
  gameResults: GameResult[];

  @ManyToMany(() => Task, task => task.users)
  @JoinTable()
  tasks: Task[];

  @ManyToMany(() => Call, call => call.users)
  @JoinTable()
  calls: Call[];

  @ManyToMany(() => Message, message => message.users)
  @JoinTable()
  messages: Message[];
}
