import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { KhachHang } from "./KhachHang";

@Entity()
export class KhieuNai {
  @PrimaryColumn()
  maKhieuNai!: string;

  @ManyToOne(() => KhachHang)
  @JoinColumn({ name: 'khachHangMaKhachHang' })
  khachHang!: KhachHang;

  @Column({ type: "timestamp" })
  ngayKhieuNai!: Date;

  @Column("text")
  dienGiai! : string;
}
