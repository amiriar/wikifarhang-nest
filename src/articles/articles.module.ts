import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/Article.entitiy';
import { User } from 'src/entities/User.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AdminArticlesController } from 'src/admin/articles/articles.controller';
import { AdminArticlesService } from 'src/admin/articles/articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User]), AuthModule],
  controllers: [ArticlesController, AdminArticlesController],
  providers: [ArticlesService, AdminArticlesService],
  exports: [ArticlesService]
})
export class ArticlesModule {}
