import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  generatedCode: string;

  @Column()
  startDate: Date;

  @Column()
  finishDate: Date;

  @ManyToMany(() => User, user => user.calls)
  users: User[];
}
