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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  passwordHash: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @OneToMany(() => UserWorkspaces, userWorkspaces => userWorkspaces.user)
  userWorkspaces: UserWorkspaces[];

  @ApiProperty()
  @OneToMany(() => UserChatrooms, userChatrooms => userChatrooms.user)
  userChatrooms: UserChatrooms[];

  @ApiProperty()
  @OneToMany(() => GameResult, gameResult => gameResult.user)
  gameResults: GameResult[];

  @ApiProperty()
  @ManyToMany(() => Task, task => task.users)
  @JoinTable()
  tasks: Task[];

  @ApiProperty()
  @ManyToMany(() => Call, call => call.users)
  @JoinTable()
  calls: Call[];

  @ApiProperty()
  @OneToMany(() => Message, message => message.user)
  @JoinTable()
  messages: Message[];
}
