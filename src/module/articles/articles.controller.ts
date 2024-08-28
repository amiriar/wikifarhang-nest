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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/create-article.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/AuthGuard.guard';
import * as moment from 'moment-jalaali';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/entities/User.entity';
import { Article } from 'src/entities/Article.entitiy';
import { EditHistoryDto } from '../admin/articles/dto/EditHistory.dto';

moment.loadPersian();

@ApiTags('Articles') 
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({
    status: 200,
    description: 'List of articles retrieved successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single article by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article',
  })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Get(':id/:language')
  @ApiOperation({ summary: 'Get a single article by ID and language' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article',
  })
  @ApiParam({
    name: 'language',
    required: true,
    description: 'The language of the article',
  })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async getArticle(
    @Param('id') id: string,
    @Param('language') language: string,
  ) {
    return this.articlesService.findArticleByIdAndLanguage(id, language);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        moreInformation: { type: 'array', items: { type: 'object' } },
        note: { type: 'array', items: { type: 'string' } },
        resources: { type: 'array', items: { type: 'string' } },
        gotTo: { type: 'array', items: { type: 'string' } },
        extras: { type: 'array', items: { type: 'string' } },
        languages: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully.',
    type: Article,
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() request: Request,
  ): Promise<Article> {
    const user = request.user as User;

    createArticleDto.author = user.id;

    createArticleDto.date = moment().format('jYYYY/jMM/jDD HH:mm');

    createArticleDto.approved = false;
    createArticleDto.approvedBySuperAdmin = false;
    createArticleDto.isVisible = false;

    console.log(createArticleDto);
    

    return this.articlesService.create(createArticleDto);
  }


  @Post('/articles/:id/pending-changes')
  async addPendingChange(
    @Param('id') articleId: string,
    @Body() editHistoryDto: EditHistoryDto
  ): Promise<Article> {
    return this.articlesService.addPendingChange(articleId, editHistoryDto);
  }
  

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update an article by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        moreInformation: { type: 'array', items: { type: 'object' } },
        note: { type: 'string' },
        resources: { type: 'array', items: { type: 'string' } },
        gotTo: { type: 'array', items: { type: 'string' } },
        extras: { type: 'array', items: { type: 'string' } },
        languages: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Article updated successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() request: Request,
  ): Promise<Article> {
    const user = request.user as User;
    const editorId = user.id;
    return this.articlesService.update(id, updateArticleDto, editorId);
  }
}
