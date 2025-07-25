import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getUser(options: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
        return this.userRepository.findOne(options);
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        await this.userRepository.update(id, updateUserDto);
        return this.userRepository.findOneOrFail({ where: { id } });
    }
}
