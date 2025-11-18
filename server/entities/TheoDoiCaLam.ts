import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class TheoDoiCaLam {
  @PrimaryColumn()
  maChiTiet!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  nhanVien!: User;

  @Column({ type: "date" })
  ngayLam!: Date;

  @Column({ type: "timestamp" })
  gioVao!: Date;

  @Column({ type: "timestamp" })
  gioRa!: Date;
}
