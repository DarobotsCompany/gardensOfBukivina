import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { AdministratorEntity } from '../entities/administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdministratorDto } from '../dto/create-administrator.dto';
import { UpdateAdministratorDto } from '../dto/update-administrator.dto';
import { genSaltSync, hashSync } from 'bcrypt';
import { IMessage } from '../../../common/dtos/responses/message.interface';

@Injectable()
export class AdministratorsService {
    constructor(
        @InjectRepository(AdministratorEntity) private readonly administratorRepository: Repository<AdministratorEntity>,
    ) {}

    async getAdministrator(options: FindOneOptions<AdministratorEntity>): Promise<AdministratorEntity | null> {
        return this.administratorRepository.findOne(options);
    }

    async getAllAdministrators(): Promise<AdministratorEntity[]> {
        return this.administratorRepository.find();
    }

    async registerAdministrator(dto: CreateAdministratorDto): Promise<IMessage> {
        const { email, username, password } = dto;

        const [adminByEmail, adminByUsername] = await Promise.all([
            this.getAdministrator({ where: { email } }),
            this.getAdministrator({ where: { username } }),
        ]);

        if (adminByEmail || adminByUsername) {
            throw new ConflictException('Administrator with given email or username already exists.');
        }

        const hashedPassword = this.hashPassword(password);

        const user = this.administratorRepository.create({
            email, username, password: hashedPassword,
        });

        await this.administratorRepository.save(user);

        return { message: 'Administrator has been successfully registered.' };
    }

    async deleteAdministrator(id: number): Promise<IMessage> {
        const administrator = await this.administratorRepository.findOne({ where: { id } });

        if (!administrator) {
            throw new NotFoundException(`Administrator with ID ${id} not found.`);
        }

        await this.administratorRepository.delete(id);

        return { message: `Administrator with ID ${id} has been successfully deleted.` };
    }

    async updateAdministrator(id: number, updateUserDto: UpdateAdministratorDto): Promise<IMessage> {
        const administrator = await this.administratorRepository.findOne({ where: { id } });

        if (!administrator) {
            throw new NotFoundException(`Administrator with ID ${id} not found.`);
        }

        await this.administratorRepository.update(id, updateUserDto);

        await this.administratorRepository.findOneOrFail({ where: { id } });

        return { message: `Administrator with ID ${id} was successfully updated.` };
    }

    private hashPassword(password: string): string {
        return hashSync(password, genSaltSync(10))
    }
}
