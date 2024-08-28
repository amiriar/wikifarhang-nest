import { MoreInformationItem } from "src/module/articles/dto/create-article.dto";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';


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

  @Column({ nullable: true, type: 'text', array: true })
  note?: string[];

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

  @Column('jsonb', { nullable: true })
  pendingChanges: EditHistory[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}

interface EditHistory {
  id: string;
  editorId: string;
  changes: Record<string, any>;
  timestamp: string;
  changesApproved?: boolean;
}
