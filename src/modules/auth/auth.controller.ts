import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorator/public.decorator';
import { AuthenticateResponse } from './response/authenticate.response';
import { RegisterResponse } from './response/register.response';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './response/refresh.response';
import { SwitchWorkspaceDto } from './dto/switch-workspace.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponse({
    description: 'User has successfully logged in',
    type: AuthenticateResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'User has entered invalid credentials',
  })
  @ApiBadRequestResponse({
    description: "User's account is inactive",
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@Request() req): Promise<AuthenticateResponse> {
    return this.authService.login(req.user);
  }

  @Post('/register')
  @ApiCreatedResponse({
    description: 'User has successfully registered',
    type: RegisterResponse,
  })
  @ApiBadRequestResponse({
    description: 'Email or workspace name is already in use',
  })
  @Public()
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(registerDto);
  }

  @Post('/refresh')
  @ApiOkResponse({
    description: 'Token successfully refreshed',
    type: RefreshResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid token',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  async refresh(@Body() refreshDto: RefreshDto): Promise<RefreshResponse> {
    return this.authService.refresh(refreshDto);
  }

  @Post('/switch')
  @ApiOkResponse({
    description: 'Workspace successfully switched',
    type: RefreshResponse,
  })
  @ApiBadRequestResponse({
    description: 'User not found or trying to switch into current workspace',
  })
  @HttpCode(HttpStatus.OK)
  async switchWorkspace(
    @Request() req,
    @Body() dto: SwitchWorkspaceDto,
  ): Promise<RefreshResponse> {
    return this.authService.switchWorkspace(+req.user.id, dto);
  }
}
