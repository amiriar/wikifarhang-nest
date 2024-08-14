import {
  Controller,
  Delete,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { AuthGuard } from 'src/guard/AuthGuard.guard';
import { Article } from 'src/entities/Article.entitiy';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminArticlesService } from './articles.service';

@ApiTags('(Admin Panel) Articles')  // Group these routes under "Admin Articles"
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(
    private readonly articlesService: AdminArticlesService,
    @InjectRepository(Article) private readonly articlesRepository: Repository<Article>,
  ) {}

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Delete an article by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the article to be deleted' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.articlesService.remove(id);
  }

  @Patch(':id/toggle-admin-approval')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Toggle admin approval status of an article' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the article to be toggled' })
  @ApiResponse({ status: 200, description: 'Article admin approval status toggled.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  toggleAdminApproval(@Param('id') id: string): Promise<Article> {
    return this.articlesService.toggleAdminApproval(id);
  }

  @Patch(':id/toggle-superadmin-approval')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Toggle superadmin approval status of an article' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the article to be toggled' })
  @ApiResponse({ status: 200, description: 'Article superadmin approval status toggled.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  toggleSuperAdminApproval(@Param('id') id: string): Promise<Article> {
    return this.articlesService.toggleSuperAdminApproval(id);
  }
}
