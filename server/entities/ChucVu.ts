import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class ChucVu {
  @PrimaryColumn()
  maChucVu!: string;

  @Column({ length: 50 })
  tenChucVu!: string;
}
