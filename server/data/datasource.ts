import "reflect-metadata";
import * as entities from "../entities";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "aishiteru1024",
  database: "postgres",
  synchronize: false,   // Tắt auto-sync, sử dụng migrations
  logging: true,
  entities: [
    entities.User, entities.CoSo, entities.Phong, entities.HangPhong, entities.DonDatPhong, entities.ChiTietDonDatPhong, entities.DonGia,
    entities.DichVu, entities.DonDatDichVu, entities.NhanVien, entities.ChucVu, entities.CaLam, entities.DangKyCaLam,
    entities.TheoDoiCaLam, entities.KhachHang, entities.KhieuNai
  ],
  migrations: ["src/migrations/*.ts"], // Đường dẫn đến migrations
  migrationsTableName: "migrations", // Tên bảng lưu trữ migration history
});
