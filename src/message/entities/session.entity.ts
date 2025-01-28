import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';

import { Message } from './message.entity';

export enum SessionStatus {
  BOT_RESOLUTION = 0,
  REFERRED_TO_HUMAN = 1,
  ENDED_OFF_TOPIC = 2,
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.BOT_RESOLUTION,
  })
  status: SessionStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.session, {
    cascade: true,
  })
  messages: Message[];
}
