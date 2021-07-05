import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity()
export class GameData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  data: Record<string, unknown>;

  @ManyToOne(() => Game, game => game.gameResults)
  game: Game;
}
