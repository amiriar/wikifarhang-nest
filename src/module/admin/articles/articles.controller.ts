import { Controller, Delete, Param, UseGuards, Patch, Req, Put, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/AuthGuard.guard';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminArticlesService } from './articles.service';
import { Article } from 'src/entities/Article.entitiy';
import { User } from 'src/entities/User.entity';
import { Request } from 'express';

@ApiTags('(Admin Panel) Articles')
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(
    private readonly articlesService: AdminArticlesService,
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Delete an article by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article to be deleted',
  })
  @ApiResponse({ status: 200, description: 'Article deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.articlesService.remove(id);
  }

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get all articles pending approval' })
  @ApiResponse({
    status: 200,
    description: 'List of articles pending approval retrieved successfully.',
    type: [Article],  // This specifies the response type as an array of Articles
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  getPendingApprovalArticles(): Promise<Article[]> {
    return this.articlesService.findPendingApprovalArticles();
  }

  @Get('pending-changes')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get all articles changes pending approval' })
  @ApiResponse({
    status: 200,
    description: 'List of articles pending approval retrieved successfully.',
    type: [Article],  // This specifies the response type as an array of Articles
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  findPendingChangesApprovalArticles(): Promise<Article[]> {
    return this.articlesService.findPendingChangesApprovalArticles();
  }


  @Patch(':id/toggle-admin-approval')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Toggle admin approval status of an article' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article to be toggled',
  })
  @ApiResponse({
    status: 200,
    description: 'Article admin approval status toggled.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  toggleAdminApproval(@Param('id') id: string): Promise<Article> {
    return this.articlesService.toggleAdminApproval(id);
  }

  @Patch(':id/toggle-superadmin-approval')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Toggle superadmin approval status of an article' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article to be toggled',
  })
  @ApiResponse({
    status: 200,
    description: 'Article superadmin approval status toggled.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  toggleSuperAdminApproval(@Param('id') id: string): Promise<Article> {
    return this.articlesService.toggleSuperAdminApproval(id);
  }

  @Put(':id/approve')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Approve pending changes to an article' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending changes approved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Article or changes not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  async approveChanges(@Param('id') id: string, @Req() request: Request): Promise<Article> {
    const user = request.user as User;

    return this.articlesService.approveChanges(id, user.id);
  }

  @Put(':id/reject')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Reject pending changes to an article' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending changes rejected successfully.',
  })
  @ApiResponse({ status: 404, description: 'Article or changes not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  async rejectChanges(@Param('id') id: string, @Req() request: Request): Promise<Article> {
    return this.articlesService.rejectChanges(id);
  }
}
