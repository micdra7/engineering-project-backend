import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SeederService } from './seeder.service';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  @ApiOkResponse({ description: 'Database is successfully seeded' })
  async seed() {
    await this.seederService.removeAll();
    await this.seederService.seed();
  }
}
