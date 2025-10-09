import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Phong } from "./Phong";

@Entity()
export class HangPhong {
  @PrimaryColumn()
  maHangPhong!: string;

  @Column({ length: 50 })
  tenHangPhong!: string;

  @Column({ type: 'int', default: 2 })
  sucChua!: number;

  @Column({ length: 200 })
  moTa!: string;

  @Column({ nullable: true })
  hinhAnh?: string;

  @OneToMany(() => Phong, (phong) => phong.hangPhong)
  phong!: Phong[];
}
