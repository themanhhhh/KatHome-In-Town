import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { CoSo } from "./CoSo";
import { HangPhong } from "./HangPhong";

@Entity()
export class Phong {
  @PrimaryColumn()
  maPhong!: string;

  @ManyToOne(() => HangPhong, (hp) => hp.phong)
  hangPhong!: HangPhong;

  @ManyToOne(() => CoSo, (cs) => cs.phong)
  coSo!: CoSo;

  @Column({ length: 200 })
  moTa! : string;
}
