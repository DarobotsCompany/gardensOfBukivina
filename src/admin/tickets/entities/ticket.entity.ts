import { BasicEntity } from 'src/database/entities/basic.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { TicketType } from 'src/common/enums/ticket-type.enum';

@Entity('tickets')
export class TicketEntity extends BasicEntity {
    @ManyToOne(() => UserEntity, (user) => user.tickets, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ nullable: false })
    message: string;

    @Column({ nullable: true })
    anotherPhone?: string;

    @Column({ nullable: false, default: TicketType.GENERAL_QUESTION })
    category: TicketType;
}