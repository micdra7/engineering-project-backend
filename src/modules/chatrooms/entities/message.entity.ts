import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chatroom } from './chatroom.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  sendTime: Date;

  @ManyToOne(() => User, user => user.messages)
  user: User;

  @ManyToOne(() => Chatroom, chatroom => chatroom.messages)
  chatroom: Chatroom;
}
