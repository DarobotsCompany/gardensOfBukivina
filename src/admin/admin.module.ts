import { Module } from '@nestjs/common';
import { AdministratorsModule } from './administrators/administrators.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

const routes = [
  {
    path: 'admin',
    children: [
      {
        path: '/administrators',
        module: AdministratorsModule,
      },
      {
        path: '/chats',
        module: ChatsModule,
      },
      {
        path: '/messages',
        module: MessagesModule,
      },
      {
        path: '/auth',
        module: AuthModule,
      },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    AdministratorsModule, 
    ChatsModule, 
    MessagesModule,
    AuthModule, 
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
