import { BasicEntity } from 'src/database/entities/basic.entity';
import {
    Column,
    Entity,
} from 'typeorm';

@Entity()
export class UserEntity extends BasicEntity {
    @Column({ nullable: true })
    phone?: string;

    @Column({ unique: true, nullable: false })
    telegramId: number;

    @Column({ nullable: true })
    username?: string;

    @Column({ nullable: true })
    fullName?: string;
}