import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../utils/pagination.decorator';
import { PaginationResponse } from '../../utils/pagination.response';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { CallResponse } from './response/call.response';

@ApiTags('Calls')
@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Call created',
    type: CallResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  async create(@Body() dto: CreateCallDto): Promise<CallResponse> {
    return this.callsService.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(CallResponse, 'List is successfully fetched')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<CallResponse>> {
    return this.callsService.findAll(+req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns selected call',
    type: CallResponse,
  })
  async findOne(@Param('id') id: string): Promise<CallResponse> {
    return this.callsService.findOne(+id);
  }

  @Get('uuid/:uuid')
  @ApiOkResponse({
    description: 'Returns selected call',
    type: CallResponse,
  })
  async findByUuid(@Param('uuid') uuid: string): Promise<CallResponse> {
    return this.callsService.findByUuid(uuid);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Updates call for given id',
    type: CallResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  update(@Param('id') id: string, @Body() dto: UpdateCallDto) {
    return this.callsService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Deletes call for given id',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.callsService.remove(+id);
  }
}
