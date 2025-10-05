import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class KhachHang {
  @PrimaryColumn()
  maKhachHang!: string;

  @Column({ length: 50 })
  ten!: string;

  @Column({ type: "date" })
  ngaySinh!: Date;

  @Column({ type: "enum", enum: ["Nam", "Nữ"] })
  gioiTinh!: string;

  @Column({ length: 50 })
  email!: string;

  @Column({ length: 10 })
  sdt!: string;

  @Column({ length: 20 })
  quocTich!: string;

  @Column({ length: 12 })
  cccd!: string;
}
