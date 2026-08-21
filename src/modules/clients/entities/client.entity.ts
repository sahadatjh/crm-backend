import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ClientCommunication } from './client-communication.entity';

export enum ClientStatus {
  LEAD = 'LEAD',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'company_name', length: 255 })
  companyName: string;

  @Column({ name: 'contact_person', length: 150, nullable: true })
  contactPerson: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ length: 100, nullable: true })
  industry: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.LEAD,
  })
  status: ClientStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => ClientCommunication, (comm) => comm.client)
  communications: ClientCommunication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
