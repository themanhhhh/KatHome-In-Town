import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CoSo } from "./CoSo";
import { HangPhong } from "./HangPhong";

@Entity()
export class Phong {
  @PrimaryColumn()
  maPhong!: string;

  @ManyToOne(() => HangPhong, (hp) => hp.phong)
  @JoinColumn({ name: 'hangPhongMaHangPhong' })
  hangPhong!: HangPhong;

  @ManyToOne(() => CoSo, (cs) => cs.phong)
  @JoinColumn({ name: 'coSoMaCoSo' })
  coSo!: CoSo;

  @Column({ length: 200 })
  moTa! : string;

  @Column({ nullable: true })
  hinhAnh?: string;
}
