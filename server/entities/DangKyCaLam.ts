import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { NhanVien } from "./NhanVien";
import { CaLam } from "./CaLam";

@Entity()
export class DangKyCaLam {
  @PrimaryColumn()
  maDangKy!: string;

  @ManyToOne(() => NhanVien)
  nhanVien!: NhanVien;

  @ManyToOne(() => CaLam)
  caLam!: CaLam;

  @Column({ type: "date" })
  ngayLam!: Date;
}
