import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { DonDatPhong } from "./DonDatPhong";

@Entity()
export class Revenue {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => DonDatPhong, { onDelete: "CASCADE" })
  donDatPhong!: DonDatPhong;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "varchar", length: 50 })
  paymentMethod!: string;

  @Column({ type: "timestamp" })
  paymentDate!: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  paymentRef?: string;

  @CreateDateColumn()
  createdAt!: Date;
}

