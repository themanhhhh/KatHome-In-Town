import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAllSampleData1759701000000 implements MigrationInterface {
  name = 'SeedAllSampleData1759701000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users
    await queryRunner.query(`
      INSERT INTO "user" (id, "taiKhoan", "matKhau", gmail, "vaiTro", "isEmailVerified", "createdAt", "updatedAt") VALUES
      ('00000000-0000-0000-0000-000000000001','admin','hashed_password_here','admin@example.com','admin',true, NOW(), NOW()),
      ('00000000-0000-0000-0000-000000000002','user1','hashed_password_here','user1@example.com','user',false, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);

    // ChucVu
    await queryRunner.query(`
      INSERT INTO chuc_vu ("maChucVu", "tenChucVu") VALUES
      ('QL', 'Quản lý'),
      ('LT', 'Lễ tân')
      ON CONFLICT ("maChucVu") DO NOTHING;
    `);

    // KhachHang
    await queryRunner.query(`
      INSERT INTO khach_hang ("maKhachHang", ten, "ngaySinh", "gioiTinh", email, sdt, "quocTich", cccd) VALUES
      ('KH001', 'Nguyen Van A', '1990-01-01', 'Nam', 'a@example.com', '0900000001', 'VN', '012345678901'),
      ('KH002', 'Tran Thi B', '1992-02-02', 'Nữ', 'b@example.com', '0900000002', 'VN', '012345678902')
      ON CONFLICT ("maKhachHang") DO NOTHING;
    `);

    // NhanVien
    await queryRunner.query(`
      INSERT INTO nhan_vien ("maNhanVien", "chucVuMaChucVu", ten, "ngaySinh", "gioiTinh", "diaChi", email, sdt, "maSoThue", "ngayBatDau") VALUES
      ('NV001', 'QL', 'Le Van Quan', '1988-05-05', 'Nam', 'Hà Nội', 'quan@example.com', '0911111111', 'MST001', '2020-01-01'),
      ('NV002', 'LT', 'Pham Thi Le', '1995-06-10', 'Nữ', 'Hà Nội', 'le@example.com', '0922222222', 'MST002', '2021-06-01')
      ON CONFLICT ("maNhanVien") DO NOTHING;
    `);

    // DichVu
    await queryRunner.query(`
      INSERT INTO dich_vu ("maDichVu", "tenDichVu", gia, loai) VALUES
      ('DV001', 'Bữa sáng', 50000, 'Ăn uống'),
      ('DV002', 'Giặt ủi', 30000, 'tiện ích'),
      ('DV003', 'Đưa đón sân bay', 150000, 'khác')
      ON CONFLICT ("maDichVu") DO NOTHING;
    `);

    // DonGia (for existing HangPhong codes from seed-data or minimal VIP/STD)
    await queryRunner.query(`
      INSERT INTO don_gia ("maHangPhong", "donViTinh", "donGia") VALUES
      ('VIP', '4h', 800000),
      ('VIP', 'quaDem', 1200000),
      ('STD', '4h', 400000),
      ('STD', 'quaDem', 700000)
      ON CONFLICT ("maHangPhong", "donViTinh") DO NOTHING;
    `);

    // DonDatPhong
    await queryRunner.query(`
      INSERT INTO don_dat_phong ("maDatPhong", "coSoMaCoSo", "nhanVienMaNhanVien", "khachHangMaKhachHang", "trangThai", "phuongThucThanhToan", "checkinDuKien", "checkoutDuKien", "ngayDat") VALUES
      ('DDP001', 'TCS', 'NV001', 'KH001', 'R', 'Card', '2025-10-10 12:00:00', '2025-10-12 12:00:00', NOW()),
      ('DDP002', 'TCS', 'NV002', 'KH002', 'CF', 'Cash', '2025-11-01 12:00:00', '2025-11-02 12:00:00', NOW())
      ON CONFLICT ("maDatPhong") DO NOTHING;
    `);

    // ChiTietDonDatPhong
    await queryRunner.query(`
      INSERT INTO chi_tiet_don_dat_phong ("maChiTiet", "donDatPhongMaDatPhong", "phongMaPhong", "soNguoiLon", "soTreEm") VALUES
      ('CT001', 'DDP001', 'TCS101', 2, 0),
      ('CT002', 'DDP002', 'TCS102', 2, 1)
      ON CONFLICT ("maChiTiet") DO NOTHING;
    `);

    // DonDatDichVu
    await queryRunner.query(`
      INSERT INTO don_dat_dich_vu (id, "dichVuMaDichVu", "chiTietDonMaChiTiet", "soLuong") VALUES
      ('00000000-0000-0000-0000-00000000d001', 'DV001', 'CT001', 2),
      ('00000000-0000-0000-0000-00000000d002', 'DV002', 'CT002', 1)
      ON CONFLICT (id) DO NOTHING;
    `);

    // TheoDoiCaLam
    await queryRunner.query(`
      INSERT INTO theo_doi_ca_lam ("maChiTiet", "nhanVienMaNhanVien", "ngayLam", "gioVao", "gioRa") VALUES
      ('TD001', 'NV001', '2025-10-01', '2025-10-01 08:00:00', '2025-10-01 12:00:00'),
      ('TD002', 'NV002', '2025-10-01', '2025-10-01 12:00:00', '2025-10-01 16:00:00')
      ON CONFLICT ("maChiTiet") DO NOTHING;
    `);

    // KhieuNai
    await queryRunner.query(`
      INSERT INTO khieu_nai ("maKhieuNai", "khachHangMaKhachHang", "ngayKhieuNai", "dienGiai") VALUES
      ('KN001', 'KH001', NOW(), 'Phòng có tiếng ồn vào ban đêm'),
      ('KN002', 'KH002', NOW(), 'Điều hòa hoạt động chưa tốt')
      ON CONFLICT ("maKhieuNai") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM khieu_nai WHERE "maKhieuNai" IN ('KN001','KN002');`);
    await queryRunner.query(`DELETE FROM theo_doi_ca_lam WHERE "maChiTiet" IN ('TD001','TD002');`);
    await queryRunner.query(`DELETE FROM don_dat_dich_vu WHERE id IN ('00000000-0000-0000-0000-00000000d001','00000000-0000-0000-0000-00000000d002');`);
    await queryRunner.query(`DELETE FROM chi_tiet_don_dat_phong WHERE "maChiTiet" IN ('CT001','CT002');`);
    await queryRunner.query(`DELETE FROM don_dat_phong WHERE "maDatPhong" IN ('DDP001','DDP002');`);
    await queryRunner.query(`DELETE FROM don_gia WHERE ("maHangPhong","donViTinh") IN (('VIP','4h'),('VIP','quaDem'),('STD','4h'),('STD','quaDem'));`);
    await queryRunner.query(`DELETE FROM dich_vu WHERE "maDichVu" IN ('DV001','DV002','DV003');`);
    await queryRunner.query(`DELETE FROM nhan_vien WHERE "maNhanVien" IN ('NV001','NV002');`);
    await queryRunner.query(`DELETE FROM khach_hang WHERE "maKhachHang" IN ('KH001','KH002');`);
    await queryRunner.query(`DELETE FROM chuc_vu WHERE "maChucVu" IN ('QL','LT');`);
    await queryRunner.query(`DELETE FROM "user" WHERE id IN ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002');`);
  }
}


