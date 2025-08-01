import { BasicEntity } from 'src/database/entities/basic.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ChatEntity } from '../../admin/chats/entities/chat.entity';
import { MessageEntity } from '../../admin/messages/entities/message.entity';
import { TicketEntity } from 'src/admin/tickets/entities/ticket.entity';

@Entity('users')
export class UserEntity extends BasicEntity {
    @Column({ nullable: true })
    phone?: string;

    @Column({ unique: true, nullable: false })
    telegramId: number;

    @Column({ nullable: true })
    username?: string;

    @Column({ nullable: true })
    fullName?: string;

    @OneToMany(() => ChatEntity, (chat) => chat.user)
    chats: ChatEntity[];

    @OneToMany(() => MessageEntity, (message) => message.user)
    messages: MessageEntity[];

    @OneToMany(() => TicketEntity, (ticket) => ticket.user)
    tickets: TicketEntity[];
}
