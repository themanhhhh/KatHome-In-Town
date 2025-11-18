import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { KhachHang } from "./KhachHang";
import { User } from "./User";

@Entity({ name: 'thong_bao' })
export class ThongBao {
  @PrimaryGeneratedColumn('uuid')
  maThongBao!: string;

  // Quan hệ với khách hàng (1 khách hàng có nhiều thông báo)
  @ManyToOne(() => KhachHang, { nullable: false })
  @JoinColumn({ name: 'khachHangMaKhachHang' })
  khachHang!: KhachHang;

  // Người gửi (admin/nhân viên)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'nguoiGuiId' })
  nguoiGui?: User;

  // Tiêu đề thông báo
  @Column({ type: "varchar", length: 255 })
  tieuDe!: string;

  // Nội dung thông báo
  @Column({ type: "text" })
  noiDung!: string;

  // Loại thông báo: system, promotion, booking, payment, etc.
  @Column({ type: "varchar", length: 50, default: 'system' })
  loaiThongBao!: string;

  // Trạng thái: unread, read, archived
  @Column({ type: "varchar", length: 20, default: 'unread' })
  trangThai!: string;

  // Đã đọc chưa
  @Column({ type: "boolean", default: false })
  daDoc!: boolean;

  // Ngày đọc
  @Column({ type: "timestamp", nullable: true })
  ngayDoc?: Date;

  // Ngày tạo thông báo
  @CreateDateColumn()
  ngayTao!: Date;

  // Link liên kết (nếu có)
  @Column({ type: "varchar", length: 500, nullable: true })
  linkLienKet?: string;

  // Ghi chú (cho admin)
  @Column({ type: "text", nullable: true })
  ghiChu?: string;
}

