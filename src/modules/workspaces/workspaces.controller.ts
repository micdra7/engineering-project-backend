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

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('/add-user')
  @ApiOkResponse({ description: 'User added to workspace' })
  @HttpCode(HttpStatus.OK)
  async addUserToWorkspace(@Req() req, @Body() dto: AddToWorkspaceDto) {
    return this.workspacesService.addUserToWorkspace(
      req.user.workspaceName,
      dto,
    );
  }
}
