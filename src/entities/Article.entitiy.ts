import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

class MoreInformationItem {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image?: string; // optional field
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('json', { array: false, nullable: true })
  moreInformation: MoreInformationItem[];

  @Column({ nullable: true })
  note?: string;

  @Column('simple-array', { nullable: true })
  resources?: string[];

  @Column('simple-array', { nullable: true })
  gotTo: string[];

  @Column('simple-array', { nullable: true })
  extras: string[];

  @Column({ default: false })
  approved: boolean;

  @Column({ default: false })
  approvedBySuperAdmin: boolean;
  
  @Column({ default: false })
  isVisible: boolean;

  @Column('simple-array', { nullable: true })
  languages: string[];

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true }) 
  author: string;

  @Column('simple-json', { nullable: true })
  editHistory: EditHistory[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}

interface EditHistory {
  editorId: string;
  changes: Record<string, any>;
  timestamp: string;
}
