import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/Article.entitiy';
import { Brackets, Not, Repository } from 'typeorm';

@Injectable()
export class AdminArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
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
    return this.articlesRepository.find({
      where: [
        { pendingChanges: Not(null) },
      ],
    });
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


  async approveChanges(id: string, adminId: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article || !article.pendingChanges || article.pendingChanges.length === 0) {
      throw new NotFoundException(`No pending changes for article with ID ${id}`);
    }

    // Apply the first set of pending changes
    const pendingChange = article.pendingChanges[0];
    Object.assign(article, pendingChange.changes);

    // Remove the applied changes from pendingChanges
    article.pendingChanges.shift();

    // Update the approval status
    article.approved = true;
    article.approvedBySuperAdmin = true;
    article.isVisible = true;

    // Save the changes
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
