import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { DonDatPhong } from "./DonDatPhong";
import { Phong } from "./Phong";

@Entity()
export class ChiTietDonDatPhong {
  @PrimaryColumn()
  maChiTiet!: string;

  @ManyToOne(() => DonDatPhong, (ddp) => ddp.chiTiet)
  donDatPhong!: DonDatPhong;

  @ManyToOne(() => Phong)
  phong!: Phong;

  @Column()
  soNguoiLon!: number;

  @Column()
  soTreEm!: number;
}
