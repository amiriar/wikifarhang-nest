import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from 'src/entities/Article.entitiy';
import { CreateArticleDto, UpdateArticleDto } from './dto/create-article.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/AuthGuard.guard';
import * as moment from 'moment-jalaali';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/entities/User.entity';

moment.loadPersian();

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  // Not avaliable
  @Get(':id/:language')
  async getArticle(
    @Param('id') id: string,
    @Param('language') language: string,
    // @Req() req: Request,
  ) {
    return this.articlesService.findArticleByIdAndLanguage(id, language);
  }
  // Not avaliable

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN', 'SUPERADMIN')
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() request: Request,
  ) {
    const user = request.user as User;
    const authorId = user.id;
    const date = moment().format('jYYYY/jMM/jDD HH:mm');

    createArticleDto.author = authorId;
    createArticleDto.date = date;
    createArticleDto.approved = false;
    createArticleDto.approvedBySuperAdmin = false;
    createArticleDto.isVisisble = false;

    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN', 'SUPERADMIN')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() request: Request,
  ): Promise<Article> {
    const user = request.user as User;
    const editorId = user.id;
    return this.articlesService.update(id, updateArticleDto, editorId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async deleteArticle(@Param('id') id: string) {
    return this.articlesService.deleteArticle(id);
  }
}

// // @ts-ignore
// const user = req.user; // The authenticated user
