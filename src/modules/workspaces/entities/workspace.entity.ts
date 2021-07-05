import { TaskList } from '../../tasks/entities/taskList.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';
import { UserWorkspaces } from './userWorkspaces.entity';
import { Game } from '../../games/entities/game.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: Role;

  @OneToMany(() => UserWorkspaces, userWorkspaces => userWorkspaces.workspace)
  userWorkspaces!: UserWorkspaces[];

  @OneToMany(() => TaskList, taskList => taskList.workspace)
  taskLists: TaskList[];

  @OneToMany(() => Game, game => game.workspace)
  games: Game[];
}
