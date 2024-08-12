import {
  Controller,
  Delete,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { AuthGuard } from 'src/guard/AuthGuard.guard';
import { Article } from 'src/entities/Article.entitiy';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('admin/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService, @InjectRepository(Article) private readonly articlesRepository: Repository<Article>) {}

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  remove(@Param('id') id: string): Promise<void> {
    return this.articlesService.remove(id);
  }

  @Patch(':id/toggle-admin-approval')
  @Roles('ADMIN')
  toggleAdminApproval(@Param('id') id: string): Promise<Article> {
    return this.articlesService.toggleAdminApproval(id);
  }

  @Patch(':id/toggle-superadmin-approval')
  @Roles('SUPERADMIN')
  toggleSuperAdminApproval(@Param('id') id: string): Promise<Article> {
    return this.articlesService.toggleSuperAdminApproval(id);
  }
}
