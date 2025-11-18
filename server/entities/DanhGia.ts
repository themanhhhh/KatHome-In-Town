import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { DonDatPhong } from "./DonDatPhong";
import { Phong } from "./Phong";

@Entity({ name: 'danh_gia' })
export class DanhGia {
  @PrimaryGeneratedColumn('uuid')
  maDanhGia!: string;

  // Optional relation to booking (if user booked)
  @ManyToOne(() => DonDatPhong, { nullable: true })
  @JoinColumn({ name: 'donDatPhongMaDatPhong' })
  donDatPhong?: DonDatPhong;

  // Optional relation to room (can review specific room)
  @ManyToOne(() => Phong, { nullable: true })
  @JoinColumn({ name: 'phongMaPhong' })
  phong?: Phong;

  // Guest information (for non-logged-in users)
  @Column({ nullable: true })
  hoTen?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  soDienThoai?: string;

  // Rating (1-5 stars)
  @Column({ type: "int" })
  diemDanhGia!: number;

  // Review content
  @Column("text")
  noiDung!: string;

  // Status: pending, approved, rejected
  @Column({ default: 'pending' })
  trangThai!: string;

  @CreateDateColumn()
  ngayDanhGia!: Date;

  // Admin response
  @Column({ type: "text", nullable: true })
  phanHoi?: string;

  @Column({ type: "timestamp", nullable: true })
  ngayPhanHoi?: Date;
}

