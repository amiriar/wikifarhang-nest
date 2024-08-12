import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/Article.entitiy';
import { User } from 'src/entities/User.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/guard/AuthGuard.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User]), AuthModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService]
})
export class ArticlesModule {}
