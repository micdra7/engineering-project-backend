import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chatroom } from './chatroom.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  filePath: string;

  @Column()
  sendTime: Date;

  @ManyToMany(() => User, user => user.messages)
  users: User[];

  @ManyToOne(() => Chatroom, chatroom => chatroom.messages)
  chatroom: Chatroom;
}
