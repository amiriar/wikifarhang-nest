import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto, UpdateArticleDto } from './dto/create-article.dto';
import { User } from 'src/entities/User.entity';
import * as moment from 'moment-jalaali';
import { Article } from 'src/entities/Article.entitiy';

interface EditHistory {
  editorId: string;
  timestamp: string;
  changes: Partial<UpdateArticleDto>;
  changesApproved: boolean
}
@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.articlesRepository.find();
  }

  findOne(id: string): Promise<Article> {
    return this.articlesRepository.findOne({ where: { id } });
  }

  findAllByDESC(): Promise<Article[]> {
    return this.articlesRepository.find({
      order: { date: 'DESC' },
      take: 6,
    });
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const user = await this.usersRepository.findOne({
      where: { id: createArticleDto.author },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const article = this.articlesRepository.create(createArticleDto);

    return this.articlesRepository.save(article);
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    editorId: string,
  ): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Record the proposed changes
    const changes: Record<string, any> = {};
    Object.keys(updateArticleDto).forEach((key) => {
      if (updateArticleDto[key] !== article[key]) {
        changes[key] = updateArticleDto[key];
      }
    });

    const editEntry: EditHistory = {
      editorId,
      changes,
      timestamp: moment().format('jYYYY/jMM/jDD HH:mm'),
      changesApproved: false
    };

    // Add the changes to pendingChanges instead of applying them directly
    article.pendingChanges = article.pendingChanges
      ? [...article.pendingChanges, editEntry]
      : [editEntry];

    return this.articlesRepository.save(article);
  }

  async findArticleByIdAndLanguage(
    id: string,
    language: string,
  ): Promise<Article> {
    const article = await this.articlesRepository.findOneBy({ id });
    if (article.languages.includes(language)) {
      return article;
    }
    throw new NotFoundException(`Article not found in ${language} language`);
  }

}
