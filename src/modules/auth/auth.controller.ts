import {
  Body,
  Controller,
  HttpCode,
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@Request() req): Promise<AuthenticateResponse> {
    return this.authService.login(req.user);
  }

  @Post('/register')
  @Public()
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(registerDto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  async refresh(@Body() refreshDto: RefreshDto): Promise<RefreshResponse> {
    return this.authService.refresh(refreshDto);
  }
}
