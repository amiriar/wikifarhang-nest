import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/Article.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class AdminArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async remove(id: string): Promise<void> {
    await this.articlesRepository.delete(id);
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
}
