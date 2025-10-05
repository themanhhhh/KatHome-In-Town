import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { CoSo } from "./CoSo";
import { NhanVien } from "./NhanVien";
import { KhachHang } from "./KhachHang";
import { ChiTietDonDatPhong } from "./ChiTietDonDatPhong";

@Entity()
export class DonDatPhong {
  @PrimaryColumn()
  maDatPhong!: string;

  @ManyToOne(() => CoSo)
  coSo!: CoSo;

  @ManyToOne(() => NhanVien)
  nhanVien!: NhanVien;

  @ManyToOne(() => KhachHang)
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
  ngayHuy!: Date;

  @OneToMany(() => ChiTietDonDatPhong, (ct) => ct.donDatPhong)
  chiTiet!: ChiTietDonDatPhong[];
}
