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
      entities.User, entities.CoSo, entities.Phong, entities.DonDatPhong, entities.ChiTietDonDatPhong,
      entities.DichVu, entities.DonDatDichVu, entities.ChucVu,
      entities.TheoDoiCaLam, entities.KhachHang, entities.KhieuNai, entities.DanhGia, entities.ThongBao, entities.Revenue, entities.Report,
      entities.HoaDon
    ],
  migrations: ["src/migrations/*.ts"], // Đường dẫn đến migrations
  migrationsTableName: "migrations", // Tên bảng lưu trữ migration history
});
