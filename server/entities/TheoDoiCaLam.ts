import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { NhanVien } from "./NhanVien";

@Entity()
export class TheoDoiCaLam {
  @PrimaryColumn()
  maChiTiet!: string;

  @ManyToOne(() => NhanVien)
  nhanVien!: NhanVien;

  @Column({ type: "date" })
  ngayLam!: Date;

  @Column({ type: "timestamp" })
  gioVao!: Date;

  @Column({ type: "timestamp" })
  gioRa!: Date;
}
