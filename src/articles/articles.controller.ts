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
} from '@nestjs/swagger';
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

@ApiTags('Articles') // Group all under "Articles"
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
        note: { type: 'string' },
        resources: { type: 'array', items: { type: 'string' } },
        gotTo: { type: 'array', items: { type: 'string' } },
        extras: { type: 'array', items: { type: 'string' } },
        approved: { type: 'boolean', default: false },
        approvedBySuperAdmin: { type: 'boolean', default: false },
        isVisible: { type: 'boolean', default: false },
        languages: { type: 'array', items: { type: 'string' } },
        date: { type: 'string' },
        author: { type: 'string' },
        editHistory: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Article created successfully.', type: Article })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() request: Request,
  ): Promise<Article> {
    // Extract the user information from the request (assuming the AuthGuard sets it)
    const user = request.user as User;
    
    // Auto-fill authorId with the current user's ID
    createArticleDto.author = user.id;
    
    // Set the current date in the desired format (Jalali format using moment-jalaali)
    createArticleDto.date = moment().format('jYYYY/jMM/jDD HH:mm');
    
    // Initialize other properties with default values
    createArticleDto.approved = false;
    createArticleDto.approvedBySuperAdmin = false;
    createArticleDto.isVisible = false;

    // Call the service method to create the article
    return this.articlesService.create(createArticleDto);
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

  // @Delete(':id')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('ADMIN', 'SUPERADMIN')
  // @ApiOperation({ summary: 'Delete an article by ID' })
  // @ApiParam({ name: 'id', required: true, description: 'The ID of the article' })
  // @ApiResponse({ status: 200, description: 'Article deleted successfully.' })
  // @ApiResponse({ status: 404, description: 'Article not found.' })
  // @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  // async deleteArticle(@Param('id') id: string) {
  //   return this.articlesService.deleteArticle(id);
  // }
}
