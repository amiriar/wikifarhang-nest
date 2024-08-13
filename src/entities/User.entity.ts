import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  getRepository,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Article } from './Article.entitiy';
import { Role } from './role.entity';
import { Max, Min } from 'class-validator';
import { Otp } from './Otp.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column({ unique: true, nullable: true })
  email?: string;
  
  @Column({ default: false })
  verifiedEmail?: string;
  
  @Column({ nullable: true })
  password?: string;

  @Column({ default: 'USER' })
  roles: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phoneNumber: string;
  
  @Column({ nullable: true })
  otp?: string;

  @Column({ nullable: true })
  otpExpiresAt?: Date;

  @OneToMany(() => Article, (article) => article.author)
  articles?: Article[];

  @Column({ nullable: true })
  lastDateIn: string;

  @Column({ nullable: true })
  madeIn: string;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];
  
  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
