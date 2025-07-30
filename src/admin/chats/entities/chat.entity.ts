import { BasicEntity } from 'src/database/entities/basic.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AdministratorEntity } from '../../administrators/entities/administrator.entity';
import { MessageEntity } from '../../messages/entities/message.entity';
import { ChatStatus } from '../enums/chat-status.enum';

@Entity('chats')
export class ChatEntity extends BasicEntity {
    @ManyToOne(() => UserEntity, (user) => user.chats, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => AdministratorEntity, (admin) => admin.chats, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'admin_id' })
    administrator?: AdministratorEntity;

    @OneToMany(() => MessageEntity, (message) => message.chat, { cascade: true })
    messages: MessageEntity[];

    @Column({ default: ChatStatus.NEW })
    status: ChatStatus;
}