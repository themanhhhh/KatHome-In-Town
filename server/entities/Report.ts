import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Report')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: 'revenue' | 'bookings' | 'occupancy' | 'customer' | 'rooms';

  @Column({ type: 'varchar', length: 50 })
  period!: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

  @Column({ type: 'varchar', length: 50, default: 'processing' })
  status!: 'completed' | 'processing' | 'failed';

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  value!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  change!: number;

  @Column({ type: 'varchar', length: 20, default: 'stable' })
  trend!: 'up' | 'down' | 'stable';

  @Column({ type: 'varchar', length: 50, nullable: true })
  fileSize?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

