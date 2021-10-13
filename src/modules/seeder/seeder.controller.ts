import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { SeederService } from './seeder.service';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Database is successfully seeded' })
  @Public()
  async seed() {
    await this.seederService.removeAll();
    await this.seederService.seed();
  }
}
