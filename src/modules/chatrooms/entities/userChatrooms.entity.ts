import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chatroom } from './chatroom.entity';

@Entity()
export class UserChatrooms {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  chatroomId!: number;

  @ManyToOne(() => User, user => user.userChatrooms)
  user!: User;

  @ManyToOne(() => Chatroom, chatroom => chatroom.userChatrooms)
  chatroom!: Chatroom;
}
