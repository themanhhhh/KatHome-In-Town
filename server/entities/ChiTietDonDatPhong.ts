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

  @Column({ type: "timestamp" })
  checkInDate!: Date;

  @Column({ type: "timestamp" })
  checkOutDate!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  donGia?: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  thanhTien?: number;

  @Column({ 
    type: "enum", 
    enum: ["reserved", "paid", "checked_in", "checked_out", "cancelled"],
    default: "reserved" 
  })
  trangThai!: string;

  @Column({ type: "timestamp", nullable: true })
  actualCheckInTime?: Date;

  @Column({ type: "timestamp", nullable: true })
  actualCheckOutTime?: Date;
}
