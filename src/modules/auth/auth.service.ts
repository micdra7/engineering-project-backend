import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { CreateWorkspaceDto } from '../workspaces/dto/create-workspace.dto';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { Role } from '../workspaces/entities/role.enum';
import { Connection } from 'typeorm';

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

    const workspace: CreateWorkspaceDto = {
      name: registerDto.workspaceName,
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
