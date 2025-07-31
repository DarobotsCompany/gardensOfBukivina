import { Module } from '@nestjs/common';
import { AdministratorsModule } from './administrators/administrators.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { NotionsModule } from './notions/notions.module';

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
      {
        path: '/notions',
        module: NotionsModule,
      }
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ADMIN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AdministratorsModule,
    ChatsModule,
    MessagesModule,
    AuthModule,
    NotionsModule
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
