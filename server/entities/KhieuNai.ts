import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { KhachHang } from "./KhachHang";

@Entity()
export class KhieuNai {
  @PrimaryColumn()
  maKhieuNai!: string;

  @ManyToOne(() => KhachHang)
  khachHang!: KhachHang;

  @Column({ type: "timestamp" })
  ngayKhieuNai!: Date;

  @Column("text")
  dienGiai! : string;
}
