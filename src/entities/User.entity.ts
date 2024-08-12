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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'USER' })
  roles: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  verified?: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @Column({ nullable: true })
  lastDateIn: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
