import { Module } from '@nestjs/common';
import { AdminArticlesController } from './articles.controller';
import { AdminArticlesService } from './articles.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AdminArticlesController],
  providers: [AdminArticlesService, UsersService],
  exports: [AdminArticlesController],
})
export class ArticlesModule {}
