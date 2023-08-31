import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  async get(@Query('page') page: string) {
    return this.scraperService.scrap(page);
  }
}
