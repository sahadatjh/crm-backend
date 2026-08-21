import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './client.entity';

export enum CommunicationType {
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  MEETING = 'MEETING',
  OTHER = 'OTHER',
}

@Entity('client_communications')
export class ClientCommunication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.communications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'enum', enum: CommunicationType })
  type: CommunicationType;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'communication_date', type: 'timestamp' })
  communicationDate: Date;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
