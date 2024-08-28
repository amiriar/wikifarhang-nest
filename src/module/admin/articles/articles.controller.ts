import { Controller, Delete, Param, UseGuards, Patch, Req, Put, Get, NotFoundException, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/AuthGuard.guard';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminArticlesService } from './articles.service';
import { Article } from 'src/entities/Article.entitiy';
import { User } from 'src/entities/User.entity';
import { Request } from 'express';
import { ApproveChangeDto } from './dto/approve-change.dto';
import { RejectChangeDto } from './dto/reject-change.dto';

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
    type: [Article],
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
    type: [Article],
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


  @Put(':id/pending-changes/:changeId/approve')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Approve a pending change' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article',
  })
  @ApiParam({
    name: 'changeId',
    required: true,
    description: 'The ID of the pending change',
  })
  @ApiBody({
    description: 'Reason for approving the change',
    type: ApproveChangeDto,
  })
  @ApiResponse({ status: 200, description: 'Pending change approved successfully.' })
  @ApiResponse({ status: 404, description: 'Article or change not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  async approvePendingChange(
    @Param('id') articleId: string,
    @Param('changeId') changeId: string,
    @Body() approveChangeDto: ApproveChangeDto,
  ): Promise<Article> {
    return this.articlesService.approvePendingChange(articleId, changeId, approveChangeDto.reason);
  }

  @Put(':id/pending-changes/:changeId/reject')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Reject a pending change' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the article',
  })
  @ApiParam({
    name: 'changeId',
    required: true,
    description: 'The ID of the pending change',
  })
  @ApiBody({
    description: 'Reason for rejecting the change',
    type: RejectChangeDto,
  })
  @ApiResponse({ status: 200, description: 'Pending change rejected successfully.' })
  @ApiResponse({ status: 404, description: 'Article or change not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  async rejectChanges(
    @Param('id') id: string,
    @Param('changeId') changeId: string,
    @Body() rejectChangeDto: RejectChangeDto,
  ): Promise<Article> {
    return this.articlesService.rejectChanges(id, changeId, rejectChangeDto.reason);
  }
  
}
