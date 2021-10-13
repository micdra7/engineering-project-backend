import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthenticateResponse } from './response/authenticate.response';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponse } from './response/register.response';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { Role } from '../workspaces/entities/role.enum';
import { Connection } from 'typeorm';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './response/refresh.response';
import { UserWorkspacesResponse } from '../workspaces/responses/userWorkspaces.response';
import { SwitchWorkspaceDto } from './dto/switch-workspace.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly workspacesService: WorkspacesService,
    private connection: Connection,
  ) {}

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const user: User = await this.usersService.findByEmail(authLoginDto.email);

    if (
      user &&
      (await bcrypt.compare(authLoginDto.password, user.passwordHash))
    ) {
      return user;
    }

    return null;
  }

  async login(user: User): Promise<AuthenticateResponse> {
    const workspaces = await this.usersService.getUserWorkspaces(user.id);
    const defaultWorkspace = workspaces.filter(w => w.isDefault)[0];
    const payload = {
      email: user.email,
      sub: user.id,
      role: defaultWorkspace.role,
      wsp: defaultWorkspace.workspaceName,
    };

    const dbUser = await this.usersService.findByEmail(user.email);

    if (!dbUser.isActive) {
      throw new BadRequestException('Your account is inactive');
    }

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.validFor'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.refreshValidFor'),
      }),
      workspaces,
    };
  }

  async refresh(dto: RefreshDto): Promise<RefreshResponse> {
    try {
      const user = await this.usersService.findByEmail(dto.email);

      if (!user) {
        throw new Error('User not found');
      }

      const decoded = this.jwtService.verify<{
        email: string;
        id: number;
        role: number;
        wsp: string;
      }>(dto.refreshToken, { secret: this.configService.get('jwt.secret') });

      const workspaces = await this.usersService.getUserWorkspaces(user.id);
      const currentWorkspace: UserWorkspacesResponse = workspaces.filter(
        w => w.workspaceName === decoded.wsp,
      )[0];

      const payload = {
        email: dto.email,
        sub: user.id,
        role: currentWorkspace.role,
        wsp: currentWorkspace.workspaceName,
      };

      return {
        accessToken: this.jwtService.sign(payload, {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.validFor'),
        }),
        refreshToken: this.jwtService.sign(payload, {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.refreshValidFor'),
        }),
      };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }

  async switchWorkspace(
    userId: number,
    dto: SwitchWorkspaceDto,
  ): Promise<RefreshResponse> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const accessTokenPayload = this.jwtService.verify<{
        email: string;
        id: number;
        role: number;
        wsp: string;
      }>(dto.accessToken, { secret: this.configService.get('jwt.secret') });

      this.jwtService.verify<{
        email: string;
        id: number;
        role: number;
        wsp: string;
      }>(dto.refreshToken, { secret: this.configService.get('jwt.secret') });

      if (accessTokenPayload.wsp === dto.workspaceName) {
        throw new BadRequestException(
          'Users cannot switch into workspace they are currently in',
        );
      }

      const userWorkspaces = await this.usersService.getUserWorkspaces(userId);

      if (!userWorkspaces.some(w => w.id === dto.workspaceId)) {
        throw new BadRequestException(
          'User does not belong to given workspace',
        );
      }

      const currentWorkspace = userWorkspaces.filter(
        w => w.id === dto.workspaceId,
      )[0];

      const payload = {
        email: user.email,
        sub: user.id,
        role: currentWorkspace.role,
        wsp: currentWorkspace.workspaceName,
      };

      return {
        accessToken: this.jwtService.sign(payload, {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.validFor'),
        }),
        refreshToken: this.jwtService.sign(payload, {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.refreshValidFor'),
        }),
      };
    } catch (error) {
      throw new BadRequestException(error.message ?? 'Invalid tokens');
    }
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const userWithGivenEmailExists = !!(await this.usersService.findByEmail(
      registerDto.email,
    ));
    if (userWithGivenEmailExists) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const workspaceWithGivenNameExists =
      !!(await this.workspacesService.findByName(registerDto.workspaceName));
    if (workspaceWithGivenNameExists) {
      throw new HttpException(
        'Workspace name is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }
    let result: RegisterResponse = null;

    const user: CreateUserDto = {
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: registerDto.password,
    };

    const workspace = {
      name: registerDto.workspaceName,
      isDefault: true,
    };

    await this.connection.transaction(async manager => {
      const dbUser: User = manager.create(User, {
        ...user,
        passwordHash: await bcrypt.hash(
          user.password,
          this.configService.get<number>('saltOrRounds'),
        ),
      });
      const dbWorkspace: Workspace = manager.create(Workspace, workspace);

      await manager.save(dbUser);
      await manager.save(dbWorkspace);

      const dbUserWorkspace: UserWorkspaces = manager.create(UserWorkspaces, {
        userId: dbUser.id,
        user: dbUser,
        workspaceId: dbWorkspace.id,
        workspace: dbWorkspace,
        role: Role.Admin,
      });

      await manager.save(dbUserWorkspace);

      result = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        isActive: true,
        workspace: {
          id: dbWorkspace.id,
          name: dbWorkspace.name,
        },
      };
    });

    return result;
  }
}
