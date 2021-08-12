import { Test, TestingModule } from '@nestjs/testing';
import { TasksListsController } from './tasksList.controller';
import { TaskListsService } from './tasksList.service';

describe('TasksListsController', () => {
  let controller: TasksListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksListsController],
      providers: [TaskListsService],
    }).compile();

    controller = module.get<TasksListsController>(TasksListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
