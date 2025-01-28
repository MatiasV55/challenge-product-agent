import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities/message.entity';
import { Session } from './entities/session.entity';
import { MessageService } from './services/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Session])],
  controllers: [],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
