import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { HangPhong } from "./HangPhong";

@Entity()
export class DonGia {
  @PrimaryColumn()
  maHangPhong!: string;

  @PrimaryColumn()
  donViTinh!: string;

  @ManyToOne(() => HangPhong, (hangPhong) => hangPhong.donGia, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: "maHangPhong", referencedColumnName: "maHangPhong" }])
  hangPhong!: HangPhong;

  @Column()
  donGia!: number;
}
