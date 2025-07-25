import { BasicEntity } from 'src/database/entities/basic.entity';
import {
    Column,
    Entity,
} from 'typeorm';
import { RolesEnum } from '../../roles/enums/roles.enum';

@Entity()
export class AdministratorEntity extends BasicEntity {
    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({
        type: 'enum',
        enum: RolesEnum,
        default: RolesEnum.MANAGER,
    })
    role: RolesEnum;
}