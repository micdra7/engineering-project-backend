import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Call } from './entities/call.entity';
import { CallResponse } from './response/call.response';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private callRepository: Repository<Call>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateCallDto): Promise<CallResponse> {
    const users = await this.userRepository.findByIds(dto.assignedUserIds);

    const call = await this.callRepository.save({
      name: dto.name,
      startDate: dto.startDate,
      finishDate: dto.finishDate,
      users,
    });

    return {
      id: call.id,
      name: call.name,
      startDate: call.startDate,
      finishDate: call.finishDate,
      assignedUserIds: dto.assignedUserIds,
    };
  }

  async findOne(id: number): Promise<CallResponse> {
    const call = await this.callRepository.findOne(id, {
      relations: ['users'],
    });

    return {
      id: call.id,
      name: call.name,
      startDate: call.startDate,
      finishDate: call.finishDate,
      assignedUserIds: call.users.map(user => user.id),
    };
  }

  async update(id: number, dto: UpdateCallDto): Promise<CallResponse> {
    const call = await this.callRepository.findOne(id);
    const users = await this.userRepository.findByIds(dto.assignedUserIds);

    call.name = dto.name;
    call.startDate = dto.startDate;
    call.finishDate = dto.finishDate;
    call.users = users;

    await this.callRepository.update(id, call);

    return {
      id,
      name: call.name,
      startDate: call.startDate,
      finishDate: call.finishDate,
      assignedUserIds: dto.assignedUserIds,
    };
  }

  async remove(id: number): Promise<void> {
    const call = await this.callRepository.findOne(id);

    await this.callRepository.remove(call);
  }
}
