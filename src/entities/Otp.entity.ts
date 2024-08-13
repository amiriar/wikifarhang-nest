import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otp: string;

  @ManyToOne(() => User, (user) => user.otps)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}
