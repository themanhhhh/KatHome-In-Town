import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { KhachHang } from "./KhachHang";
import { DonDatPhong } from "./DonDatPhong";

@Entity({ name: 'khieu_nai' })
export class KhieuNai {
  @PrimaryGeneratedColumn('uuid')
  maKhieuNai!: string;

  // Optional relation to customer (if logged in)
  @ManyToOne(() => KhachHang, { nullable: true })
  @JoinColumn({ name: 'khachHangMaKhachHang' })
  khachHang?: KhachHang;

  @Column({ nullable: true })
  khachHangMaKhachHang?: string;

  // Optional relation to booking
  @ManyToOne(() => DonDatPhong, { nullable: true })
  @JoinColumn({ name: 'donDatPhongMaDatPhong' })
  donDatPhong?: DonDatPhong;

  @Column({ nullable: true })
  donDatPhongMaDatPhong?: string;

  // Guest information (for non-logged-in users)
  @Column({ nullable: true })
  hoTen?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  soDienThoai?: string;

  // Complaint type: service, room, staff, other
  @Column({ default: 'other' })
  loaiKhieuNai!: string;

  // Title/subject
  @Column()
  tieuDe!: string;

  @CreateDateColumn()
  ngayKhieuNai!: Date;

  @Column("text")
  dienGiai!: string;

  // Status: pending, processing, resolved, rejected
  @Column({ default: 'pending' })
  trangThai!: string;

  // Admin response
  @Column({ type: "text", nullable: true })
  phanHoi?: string;

  @Column({ type: "timestamp", nullable: true })
  ngayPhanHoi?: Date;
}
