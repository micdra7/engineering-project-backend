import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity()
export class GameResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  result: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Game, game => game.gameDatas)
  game: Game;

  @ManyToOne(() => User, user => user.gameResults)
  user: User;
}
