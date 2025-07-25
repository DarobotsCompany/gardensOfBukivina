import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { AdministratorEntity } from '../entities/administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdministratorDto } from '../dto/create-administrator.dto';
import { UpdateAdministratorDto } from '../dto/update-administrator.dto';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class AdministratorsService {
    constructor(
        @InjectRepository(AdministratorEntity) private readonly administratorRepository: Repository<AdministratorEntity>,
    ) {}

    async getUser(options: FindOneOptions<AdministratorEntity>): Promise<AdministratorEntity | null> {
        return this.administratorRepository.findOne(options);
    }

    async createUser(createUserDto: CreateAdministratorDto): Promise<AdministratorEntity> {
        const user = this.administratorRepository.create(createUserDto);
        return this.administratorRepository.save(user);
    }

    async updateUser(id: number, updateUserDto: UpdateAdministratorDto): Promise<AdministratorEntity> {
        await this.administratorRepository.update(id, updateUserDto);
        return this.administratorRepository.findOneOrFail({ where: { id } });
    }

    private hashPassword(password: string): string {
        return hashSync(password, genSaltSync(10))
    }
}
