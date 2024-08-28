import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/Article.entitiy';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import { EditHistoryDto } from './dto/EditHistory.dto';
import moment from 'moment';
import { UpdateArticleDto } from 'src/module/articles/dto/create-article.dto';

interface EditHistory {
  id: string;
  editorId: string;
  timestamp: string;
  changes: Partial<UpdateArticleDto>;
  changesApproved: boolean; 
}



@Injectable()
export class AdminArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private dataSource: DataSource
  ) {}

  async remove(id: string): Promise<void> {
    await this.articlesRepository.delete(id);
  }

  async findPendingApprovalArticles(): Promise<Article[]> {
    return this.articlesRepository.createQueryBuilder('article')
      .where(new Brackets(qb => {
        qb.where('article.approved = :approved', { approved: false })
          .orWhere('article.approvedBySuperAdmin = :approvedBySuperAdmin', { approvedBySuperAdmin: false });
      }))
      .andWhere('article.pendingChanges IS NULL')
      .getMany();
  }


  async findPendingChangesApprovalArticles(): Promise<Article[]> {
    return this.dataSource
      .getRepository(Article)
      .createQueryBuilder('article')
      .where('article.pendingChanges IS NOT NULL')
      .getMany();
  }

  async approvePendingChange(articleId: string, changeId: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id: articleId } });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (!article.pendingChanges || !article.pendingChanges.length) {
      throw new NotFoundException('No pending changes found');
    }

    const change = article.pendingChanges.find(ch => ch.id === changeId);

    if (!change) {
      throw new NotFoundException('Change not found');
    }

    change.changesApproved = true;
    article.pendingChanges = article.pendingChanges.map(ch =>
      ch.id === changeId ? change : ch
    );

    return this.articlesRepository.save(article);
  }


  async toggleAdminApproval(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    article.approved = !article.approved;

    this.updateVisibility(article);

    return this.articlesRepository.save(article);
  }

  async toggleSuperAdminApproval(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    article.approvedBySuperAdmin = !article.approvedBySuperAdmin;

    this.updateVisibility(article);

    return this.articlesRepository.save(article);
  }

  private updateVisibility(article: Article): void {
    article.isVisible = article.approved && article.approvedBySuperAdmin;
  }

  async addPendingChange(articleId: string, editHistoryDto: EditHistoryDto): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id: articleId } });
  
    if (!article) {
      throw new NotFoundException('Article not found');
    }
  
    const newPendingChange: EditHistory = {
      ...editHistoryDto,
      id: moment().format('x'), // or generate a proper UUID if needed
      changesApproved: false, // Ensure this is set
    };
  
    article.pendingChanges = article.pendingChanges
      ? [...article.pendingChanges, newPendingChange]
      : [newPendingChange];
  
    return this.articlesRepository.save(article);
  }
  
  async rejectChanges(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article || !article.pendingChanges || article.pendingChanges.length === 0) {
      throw new NotFoundException(`No pending changes for article with ID ${id}`);
    }

    article.pendingChanges.shift();

    return this.articlesRepository.save(article);
  }

}
