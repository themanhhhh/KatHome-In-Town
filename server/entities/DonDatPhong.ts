import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { CoSo } from "./CoSo";
import { User } from "./User";
import { KhachHang } from "./KhachHang";
import { ChiTietDonDatPhong } from "./ChiTietDonDatPhong";

@Entity()
export class DonDatPhong {
  @PrimaryColumn()
  maDatPhong!: string;

  @ManyToOne(() => CoSo)
  @JoinColumn({ name: 'coSoMaCoSo' })
  coSo!: CoSo;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  nhanVien!: User;

  @ManyToOne(() => KhachHang)
  @JoinColumn({ name: 'khachHangMaKhachHang' })
  khachHang!: KhachHang;

  @Column({ type: "enum", enum: ["R", "CF", "CC", "AB"] })
  trangThai!: string;

  @Column({ type: "enum", enum: ["Card", "Cash"] })
  phuongThucThanhToan!: string;

  @Column({ type: "timestamp" })
  checkinDuKien!: Date;

  @Column({ type: "timestamp" })
  checkoutDuKien!: Date;

  @Column({ type: "timestamp" })
  ngayDat!: Date;

  @Column({ type: "timestamp", nullable: true })
  ngayXacNhan!: Date;

  @Column({ type: "timestamp", nullable: true })
  ngayHuy?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  customerEmail?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  customerPhone?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  customerName?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "varchar", length: 50, default: "website" })
  bookingSource?: string; // website, phone, walkin, etc.

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  totalAmount?: number;

  // Payment fields
  @Column({ type: "varchar", length: 50, nullable: true, default: 'pending' })
  paymentStatus?: string; // pending, paid, failed, refunded

  @Column({ type: "varchar", length: 50, nullable: true })
  paymentMethod?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  paymentRef?: string;

  @Column({ type: "timestamp", nullable: true })
  paidAt?: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  totalPaid?: number;

  // OTP verification fields
  @Column({ type: "varchar", length: 6, nullable: true })
  otpCode?: string;

  @Column({ type: "timestamp", nullable: true })
  otpExpiry?: Date;

  @Column({ type: "boolean", default: false })
  isVerified?: boolean;

  // Booking hold/lock fields (theo flowchart)
  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date; // Timeout 15 phút cho PENDING bookings

  @Column({ type: "int", default: 0 })
  version!: number; // Optimistic locking

  // Price breakdown fields (theo flowchart)
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  basePrice?: number; // Giá base theo loại phòng

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true, default: 0 })
  seasonalSurcharge?: number; // Giá theo mùa và sự kiện

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true, default: 0 })
  guestSurcharge?: number; // Phụ phí người thêm

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true, default: 0 })
  vatAmount?: number; // Thuế VAT

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true, default: 0 })
  discount?: number; // Giảm giá khuyến mãi

  @Column({ type: "varchar", length: 100, nullable: true })
  promotionCode?: string; // Mã khuyến mãi

  @OneToMany(() => ChiTietDonDatPhong, (ct) => ct.donDatPhong)
  chiTiet!: ChiTietDonDatPhong[];
}
