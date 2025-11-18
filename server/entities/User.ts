import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ChucVu } from "./ChucVu";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 50, unique: true, nullable: true })
  maNhanVien?: string;

  @Column({ length: 50, unique: true })
  taiKhoan!: string;

  @Column({ length: 255 })
  matKhau!: string;

  @Column({ length: 100, unique: true })
  gmail!: string;

  @Column({ default: 'user' })
  vaiTro!: string;

  @Column({ nullable: true })
  soDienThoai?: string;

  // Thông tin nhân viên (từ NhanVien)
  @Column({ length: 50, nullable: true })
  ten?: string;

  @Column({ type: "date", nullable: true })
  ngaySinh?: Date;

  @Column({ type: "enum", enum: ["Nam", "Nữ"], nullable: true })
  gioiTinh?: string;

  @Column({ length: 200, nullable: true })
  diaChi?: string;

  @ManyToOne(() => ChucVu, { nullable: true })
  @JoinColumn({ name: 'chucVuMaChucVu' })
  chucVu?: ChucVu;

  @Column({ length: 50, nullable: true })
  maSoThue?: string;

  @Column({ type: "date", nullable: true })
  ngayBatDau?: Date;

  @Column({ type: "date", nullable: true })
  ngayNghi?: Date;

  // Authentication fields
  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ nullable: true, length: 6 })
  verificationCode?: string;

  @Column({ nullable: true })
  verificationCodeExpiry?: Date;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  resetPasswordExpiry?: Date;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  hinhAnh?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
