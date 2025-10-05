import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DichVu } from "./DichVu";
import { ChiTietDonDatPhong } from "./ChiTietDonDatPhong";

@Entity()
export class DonDatDichVu {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => DichVu)
  dichVu!: DichVu;

  @ManyToOne(() => ChiTietDonDatPhong)
  chiTietDon!: ChiTietDonDatPhong;

  @Column("int")
  soLuong!: number;
}
