import { BasicEntity } from 'src/database/entities/basic.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../enums/roles.enum';
import { ChatEntity } from '../../chats/entities/chat.entity';
import { MessageEntity } from '../../messages/entities/message.entity';

@Entity('administrators')
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

    @OneToMany(() => ChatEntity, (chat) => chat.administrator)
    chats: ChatEntity[];

    @OneToMany(() => MessageEntity, (message) => message.administrator)
    messages: MessageEntity[];
}
