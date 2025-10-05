import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { HangPhong } from "./HangPhong";

@Entity()
export class DonGia {
  @PrimaryColumn()
  maHangPhong!: string;

  @PrimaryColumn()
  donViTinh!: string;

  @ManyToOne(() => HangPhong)
  hangPhong!: HangPhong;

  @Column()
  donGia!: number;
}
