import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { AuthModule } from 'src/module/auth/auth.module';
import { AdminArticlesController } from 'src/module/admin/articles/articles.controller';
import { AdminArticlesService } from 'src/module/admin/articles/articles.service';
import { Article } from 'src/entities/Article.entitiy';
import { UsersService } from '../admin/users/users.service';
import { Otp } from 'src/entities/Otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Otp]), AuthModule],
  controllers: [ArticlesController, AdminArticlesController],
  providers: [ArticlesService, AdminArticlesService, UsersService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
