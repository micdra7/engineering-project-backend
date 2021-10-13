import { Workspace } from '../../workspaces/entities/workspace.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameData } from './gameData.entity';
import { GameResult } from './gameResult.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => GameData, gameData => gameData.game)
  gameDatas: GameData[];

  @OneToMany(() => GameResult, gameResult => gameResult.game)
  gameResults: GameResult[];

  @ManyToOne(() => Workspace, workspace => workspace.games)
  workspace: Workspace;
}
