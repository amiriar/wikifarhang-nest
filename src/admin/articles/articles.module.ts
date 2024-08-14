import { Module } from '@nestjs/common';
import { AdminArticlesController } from './articles.controller';
import { AdminArticlesService } from './articles.service';

@Module({
  controllers: [AdminArticlesController],
  providers: [AdminArticlesService],
  exports: [AdminArticlesController],
})
export class ArticlesModule {}
