import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Call } from './entities/call.entity';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private callRepository: Repository<Call>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createCallDto: CreateCallDto) {
    return 'This action adds a new call';
  }

  findAll() {
    return `This action returns all calls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} call`;
  }

  update(id: number, updateCallDto: UpdateCallDto) {
    return `This action updates a #${id} call`;
  }

  remove(id: number) {
    return `This action removes a #${id} call`;
  }
}
