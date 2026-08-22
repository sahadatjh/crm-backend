import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotificationType, ResourceType } from '../../../shared/enums/notification.enum';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM_ALERT,
  })
  type: NotificationType;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({
    name: 'resource_type',
    type: 'enum',
    enum: ResourceType,
    nullable: true,
  })
  resourceType: ResourceType;

  @Column({ name: 'resource_id', type: 'uuid', nullable: true })
  resourceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
