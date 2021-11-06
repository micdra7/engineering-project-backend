import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { AddToWorkspaceDto } from './dto/add-to-workspace.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserResponse } from '../users/response/update-user.response';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('/add-user')
  @ApiOkResponse({
    description: 'User added to workspace',
    type: UpdateUserResponse,
  })
  @HttpCode(HttpStatus.OK)
  async addUserToWorkspace(
    @Req() req,
    @Body() dto: AddToWorkspaceDto,
  ): Promise<UpdateUserResponse> {
    return this.workspacesService.addUserToWorkspace(
      req.user.workspaceName,
      dto,
    );
  }
}
