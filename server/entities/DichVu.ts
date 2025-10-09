import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class DichVu {
  @PrimaryColumn()
  maDichVu!: string;

  @Column()
  tenDichVu!: string;

  @Column("int")
  gia!: number;

  @Column({ type: "enum", enum: ["Ăn uống", "tiện ích", "khác"] })
  loai!: string;

  @Column({ nullable: true })
  hinhAnh?: string;
}
