import { Injectable } from '@nestjs/common';
import { ArticlesService } from './module/articles/articles.service';

@Injectable()
export class AppService {
  constructor(private articleService: ArticlesService) {}
  async getNewArticles(count?: string) {
    return this.articleService.findAllByDESC();
  }
}
