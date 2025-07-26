import { BasicEntity } from 'src/database/entities/basic.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ChatEntity } from '../../chats/entities/chat.entity';
import { AdministratorEntity } from '../../administrators/entities/administrator.entity';

@Entity('messages')
export class MessageEntity extends BasicEntity {
    @ManyToOne(() => ChatEntity, (chat) => chat.messages, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chat_id' })
    chat: ChatEntity;

    @ManyToOne(() => UserEntity, (user) => user.messages, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: UserEntity;

    @ManyToOne(() => AdministratorEntity, (admin) => admin.messages, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'admin_id' })
    administrator?: AdministratorEntity;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: false })
    isRead: boolean;
}
