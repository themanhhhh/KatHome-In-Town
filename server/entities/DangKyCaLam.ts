import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { NhanVien } from "./NhanVien";
import { CaLam } from "./CaLam";

@Entity()
export class DangKyCaLam {
  @PrimaryColumn()
  maDangKy!: string;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'nhanVienMaNhanVien' })
  nhanVien!: NhanVien;

  @ManyToOne(() => CaLam)
  @JoinColumn({ name: 'caLamMaCaLam' })
  caLam!: CaLam;

  @Column({ type: "date" })
  ngayLam!: Date;
}
