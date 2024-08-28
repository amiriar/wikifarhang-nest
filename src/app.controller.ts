import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Articles')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the latest 6 articles' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the latest articles.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getNewArticles() {
    return await this.appService.getNewArticles();
  }
}
