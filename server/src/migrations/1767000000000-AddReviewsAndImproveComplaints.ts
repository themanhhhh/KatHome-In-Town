import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReviewsAndImproveComplaints1767000000000 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create DanhGia (Reviews) table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "danh_gia" (
                "maDanhGia" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                "donDatPhongMaDatPhong" VARCHAR,
                "phongMaPhong" VARCHAR,
                "hoTen" VARCHAR,
                "email" VARCHAR,
                "soDienThoai" VARCHAR,
                "diemDanhGia" INTEGER NOT NULL,
                "noiDung" TEXT NOT NULL,
                "trangThai" VARCHAR DEFAULT 'pending',
                "ngayDanhGia" TIMESTAMP DEFAULT now(),
                "phanHoi" TEXT,
                "ngayPhanHoi" TIMESTAMP,
                FOREIGN KEY ("donDatPhongMaDatPhong") REFERENCES "don_dat_phong"("maDatPhong") ON DELETE SET NULL,
                FOREIGN KEY ("phongMaPhong") REFERENCES "phong"("maPhong") ON DELETE SET NULL
            )
        `);

        console.log('✅ Created danh_gia table');

        // Update KhieuNai (Complaints) table - drop and recreate with new structure
        await queryRunner.query(`
            DROP TABLE IF EXISTS "khieu_nai" CASCADE
        `);

        await queryRunner.query(`
            CREATE TABLE "khieu_nai" (
                "maKhieuNai" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                "khachHangMaKhachHang" VARCHAR,
                "donDatPhongMaDatPhong" VARCHAR,
                "hoTen" VARCHAR,
                "email" VARCHAR,
                "soDienThoai" VARCHAR,
                "loaiKhieuNai" VARCHAR DEFAULT 'other',
                "tieuDe" VARCHAR NOT NULL,
                "ngayKhieuNai" TIMESTAMP DEFAULT now(),
                "dienGiai" TEXT NOT NULL,
                "trangThai" VARCHAR DEFAULT 'pending',
                "phanHoi" TEXT,
                "ngayPhanHoi" TIMESTAMP,
                FOREIGN KEY ("khachHangMaKhachHang") REFERENCES "khach_hang"("maKhachHang") ON DELETE SET NULL,
                FOREIGN KEY ("donDatPhongMaDatPhong") REFERENCES "don_dat_phong"("maDatPhong") ON DELETE SET NULL
            )
        `);

        console.log('✅ Updated khieu_nai table with new structure');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS "danh_gia" CASCADE`);
        
        // Restore old KhieuNai structure
        await queryRunner.query(`DROP TABLE IF EXISTS "khieu_nai" CASCADE`);
        await queryRunner.query(`
            CREATE TABLE "khieu_nai" (
                "maKhieuNai" VARCHAR PRIMARY KEY,
                "khachHangMaKhachHang" VARCHAR NOT NULL,
                "ngayKhieuNai" TIMESTAMP NOT NULL,
                "dienGiai" TEXT NOT NULL,
                FOREIGN KEY ("khachHangMaKhachHang") REFERENCES "khach_hang"("maKhachHang") ON DELETE CASCADE
            )
        `);

        console.log('✅ Reverted to old structure');
    }
}

