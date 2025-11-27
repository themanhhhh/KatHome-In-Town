import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoSo } from "./CoSo";

@Entity()
export class Phong {
  @PrimaryColumn()
  maPhong!: string;

  @ManyToOne(() => CoSo, (cs) => cs.phong)
  @JoinColumn({ name: 'coSoMaCoSo' })
  coSo!: CoSo;

  @Column({ length: 50 })
  tenPhong!: string;

  @Column({ length: 500 })
  moTa!: string;

  @Column({ type: 'int', default: 2 })
  sucChua!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  donGia4h?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  donGiaQuaDem!: number;

  @Column({ nullable: true })
  hinhAnh?: string;

  // Optimistic locking và room status (theo flowchart)
  @Column({ type: 'int', default: 0 })
  version!: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil?: Date; // Lock phòng tạm thời khi đang booking

  @Column({ type: 'varchar', length: 50, default: 'available' })
  status!: string; // available, maintenance, blocked, booked
}
