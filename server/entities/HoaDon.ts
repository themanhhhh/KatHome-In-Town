import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { DonDatPhong } from "./DonDatPhong";
import { User } from "./User";

@Entity()
export class HoaDon {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => DonDatPhong, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'donDatPhongMaDatPhong' })
  donDatPhong!: DonDatPhong;

  @Column({ type: "varchar", length: 50, unique: true })
  maHoaDon!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  tongTien!: number;

  @Column({ type: "varchar", length: 50 })
  phuongThucThanhToan!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  paymentRef?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'nhanVienId' })
  nhanVien?: User; // Nhân viên CSKH đã xác nhận thanh toán

  @Column({ type: "timestamp" })
  ngayThanhToan!: Date;

  @Column({ type: "text", nullable: true })
  ghiChu?: string;

  @CreateDateColumn()
  createdAt!: Date;
}


