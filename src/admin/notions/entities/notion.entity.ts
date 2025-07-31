import { AdministratorEntity } from 'src/admin/administrators/entities/administrator.entity';
import { ChatEntity } from 'src/admin/chats/entities/chat.entity';
import { BasicEntity } from 'src/database/entities/basic.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { TypeNotions } from '../enums/type-notions.enum';

@Entity('notes')
export class NotionEntity extends BasicEntity {
    @Column({ type: 'text' })
    text: string;

    @ManyToOne(() => ChatEntity, (chat) => chat.notes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chat_id' })
    chat: ChatEntity;

    @ManyToOne(() => AdministratorEntity, { nullable: false, onDelete: 'SET NULL' }) 
    administrator: AdministratorEntity;

    @Column({ type: 'text', nullable: true })
    attachments?: string;

    @Column({ nullable: false })
    type: TypeNotions 
}
