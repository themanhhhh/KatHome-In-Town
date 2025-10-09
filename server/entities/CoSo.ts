import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Phong } from "./Phong";

@Entity()
export class CoSo {
  @PrimaryColumn()
  maCoSo!: string;  // ví dụ: 145AC, 7ADT

  @Column({ length: 50 })
  tenCoSo!: string;

  @Column({ length: 100 })
  diaChi!: string;

  @Column({ length: 15 })
  sdt!: string;

  @Column({ nullable: true })
  hinhAnh?: string;

  @OneToMany(() => Phong, (phong) => phong.coSo)
  phong!: Phong[];
}
