import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '../entities/message.entity';
import { Session, SessionStatus } from '../entities/session.entity';
import { CreateMessageDto, StructuredMessageDto } from '../dtos/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async createMessage(message: CreateMessageDto): Promise<Message> {
    const session = await this.sessionRepository.findOne({
      where: { id: message.sessionId },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    const newMessage = this.messageRepository.create({
      ...message,
      session,
    });
    return await this.messageRepository.save(newMessage);
  }

  async createSession(): Promise<string> {
    const newSession = this.sessionRepository.create();
    await this.sessionRepository.save(newSession);
    return newSession.id;
  }

  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { session: { id: sessionId } },
    });
  }

  async getStructuredMessagesBySessionId(
    sessionId: string,
  ): Promise<StructuredMessageDto[]> {
    const messages = await this.getMessagesBySessionId(sessionId);
    return messages.map((message) => ({
      content: message.content,
      role: message.role,
    }));
  }

  async getSessionById(sessionId: string): Promise<Session> {
    return await this.sessionRepository.findOne({ where: { id: sessionId } });
  }

  async updateSessionStatus(
    sessionId: string,
    status: SessionStatus,
  ): Promise<Session> {
    const session = await this.getSessionById(sessionId);
    session.status = status;
    return await this.sessionRepository.save(session);
  }
}
