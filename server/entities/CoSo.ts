import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Phong } from "./Phong";

@Entity()
export class CoSo {
  @PrimaryColumn()
  maCoSo!: string;

  @Column({ length: 50 })
  tenCoSo!: string;

  @Column({ length: 100 })
  diaChi!: string;

  @Column({ length: 15 })
  soDienThoai!: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  moTa?: string;

  @Column({ nullable: true })
  hinhAnh?: string;

  @OneToMany(() => Phong, (phong) => phong.coSo)
  phong!: Phong[];
}
