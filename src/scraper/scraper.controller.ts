import { Controller, Get } from '@nestjs/common';

@Controller('scraper')
export class ScraperController {
  constructor() {}

  @Get()
  async get() {
    return 'test';
  }
}
