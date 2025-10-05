import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 50, unique: true })
  taiKhoan!: string;

  @Column({ length: 255 })
  matKhau!: string;

  @Column({ length: 100, unique: true })
  gmail!: string;

  @Column({ default: 'user' })
  vaiTro!: string;

  @Column({ nullable: true })
  soDienThoai?: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ nullable: true, length: 6 })
  verificationCode?: string;

  @Column({ nullable: true })
  verificationCodeExpiry?: Date;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  resetPasswordExpiry?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
