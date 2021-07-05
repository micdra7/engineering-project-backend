import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';
import { UserChatrooms } from './userChatrooms.entity';

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserChatrooms, userChatrooms => userChatrooms.chatroom)
  userChatrooms!: UserChatrooms;

  @OneToMany(() => Message, message => message.chatroom)
  messages: Message[];
}
