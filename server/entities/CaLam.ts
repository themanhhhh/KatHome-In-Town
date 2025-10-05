import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class CaLam {
  @PrimaryColumn()
  maCaLam!: string;

  @Column({ type: "enum", enum: [1, 2, 3, 4] })
  khungGio!: number;
}
