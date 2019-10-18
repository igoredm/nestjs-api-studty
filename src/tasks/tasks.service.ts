import { User } from './../auth/user.entity';
import { TaskRepository } from './task.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) { }

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(
    id: number,
    user: User,
  ): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

    async deleteTask(
      id: number,
      user: User,
    ): Promise<void> {
      const result = await this.taskRepository.delete({ id, userId: user.id });

      if (result.affected === 0) {
        throw new NotFoundException(`Task with id "${id}" not found`);
      }
  }

  // Meu jeito q eu tinha feito
  // async deleteTask(id: number): Promise<void> {
  //   await this.getTaskById(id);

  //   await this.taskRepository.delete(id);
  // }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
