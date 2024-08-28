import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { AuthModule } from 'src/module/auth/auth.module';
import { AdminArticlesController } from 'src/module/admin/articles/articles.controller';
import { AdminArticlesService } from 'src/module/admin/articles/articles.service';
import { Article } from 'src/entities/Article.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User]), AuthModule],
  controllers: [ArticlesController, AdminArticlesController],
  providers: [ArticlesService, AdminArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
