import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ChucVu } from "./ChucVu";

@Entity()
export class NhanVien {
  @PrimaryColumn()
  maNhanVien!: string;

  @ManyToOne(() => ChucVu)
  @JoinColumn({ name: 'chucVuMaChucVu' })
  chucVu!: ChucVu;

  @Column({ length: 50 })
  ten!: string;

  @Column({ type: "date" })
  ngaySinh!: Date;

  @Column({ type: "enum", enum: ["Nam", "Nữ"] })
  gioiTinh!: string;

  @Column({ length: 200 })
  diaChi!: string;

  @Column({ length: 50 })
  email!: string;

  @Column({ length: 10 })
  sdt!: string;

  @Column({ length: 50 })
  maSoThue!: string;

  @Column({ type: "date" })
  ngayBatDau!: Date;

  @Column({ type: "date", nullable: true })
  ngayNghi!: Date;

  @Column({ nullable: true })
  hinhAnh?: string;
}
