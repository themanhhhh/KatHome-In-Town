import { MigrationInterface, QueryRunner } from "typeorm";

export class MergeNhanVienToUser1764000000000 implements MigrationInterface {
    name = 'MergeNhanVienToUser1764000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Thêm các cột mới vào bảng user (từ NhanVien)
        await queryRunner.query(`ALTER TABLE "user" ADD "maNhanVien" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ten" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ngaySinh" DATE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gioiTinh" character varying CHECK ("gioiTinh" IN ('Nam', 'Nữ'))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "diaChi" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "chucVuMaChucVu" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "maSoThue" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ngayBatDau" DATE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ngayNghi" DATE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hinhAnh" character varying`);
        
        // 2. Thêm unique constraint cho maNhanVien
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_maNhanVien" ON "user" ("maNhanVien") WHERE "maNhanVien" IS NOT NULL`);
        
        // 3. Gộp dữ liệu từ nhan_vien sang user
        // Tìm các user đã có email trùng với email trong nhan_vien và cập nhật
        await queryRunner.query(`
            UPDATE "user" u
            SET 
                "maNhanVien" = nv."maNhanVien",
                "ten" = nv."ten",
                "ngaySinh" = nv."ngaySinh",
                "gioiTinh" = nv."gioiTinh",
                "diaChi" = nv."diaChi",
                "chucVuMaChucVu" = nv."chucVuMaChucVu",
                "maSoThue" = nv."maSoThue",
                "ngayBatDau" = nv."ngayBatDau",
                "ngayNghi" = nv."ngayNghi",
                "hinhAnh" = nv."hinhAnh",
                "soDienThoai" = COALESCE(u."soDienThoai", nv."sdt")
            FROM "nhan_vien" nv
            WHERE LOWER(u."gmail") = LOWER(nv."email")
        `);
        
        // Tạo user mới cho các nhân viên chưa có trong bảng user
        await queryRunner.query(`
            INSERT INTO "user" (
                id, "taiKhoan", "matKhau", "gmail", "vaiTro", "soDienThoai",
                "maNhanVien", "ten", "ngaySinh", "gioiTinh", "diaChi", 
                "chucVuMaChucVu", "maSoThue", "ngayBatDau", "ngayNghi", "hinhAnh",
                "isEmailVerified", "createdAt", "updatedAt"
            )
            SELECT 
                gen_random_uuid(),
                nv."maNhanVien" as "taiKhoan",
                '$2a$10$defaultpasswordhash' as "matKhau", -- Cần reset password sau
                nv."email" as "gmail",
                'staff' as "vaiTro",
                nv."sdt" as "soDienThoai",
                nv."maNhanVien",
                nv."ten",
                nv."ngaySinh",
                nv."gioiTinh",
                nv."diaChi",
                nv."chucVuMaChucVu",
                nv."maSoThue",
                nv."ngayBatDau",
                nv."ngayNghi",
                nv."hinhAnh",
                false as "isEmailVerified",
                NOW() as "createdAt",
                NOW() as "updatedAt"
            FROM "nhan_vien" nv
            WHERE NOT EXISTS (
                SELECT 1 FROM "user" u 
                WHERE LOWER(u."gmail") = LOWER(nv."email")
            )
        `);
        
        // 4. Cập nhật foreign key trong các bảng liên quan
        // Cập nhật don_dat_phong: thay nhanVienMaNhanVien bằng userId
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD COLUMN "userId" uuid;
        `);
        
        await queryRunner.query(`
            UPDATE "don_dat_phong" ddp
            SET "userId" = u.id
            FROM "user" u
            WHERE ddp."nhanVienMaNhanVien" = u."maNhanVien"
        `);
        
        // Cập nhật theo_doi_ca_lam
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            ADD COLUMN "userId" uuid;
        `);
        
        await queryRunner.query(`
            UPDATE "theo_doi_ca_lam" tdcl
            SET "userId" = u.id
            FROM "user" u
            WHERE tdcl."nhanVienMaNhanVien" = u."maNhanVien"
        `);
        
        // Cập nhật dang_ky_ca_lam
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            ADD COLUMN "userId" uuid;
        `);
        
        await queryRunner.query(`
            UPDATE "dang_ky_ca_lam" dkcl
            SET "userId" = u.id
            FROM "user" u
            WHERE dkcl."nhanVienMaNhanVien" = u."maNhanVien"
        `);
        
        // 5. Xóa các foreign key cũ và cột cũ
        // Xóa foreign key constraints cũ
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP CONSTRAINT IF EXISTS "FK_don_dat_phong_nhan_vien";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            DROP CONSTRAINT IF EXISTS "FK_theo_doi_ca_lam_nhan_vien";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            DROP CONSTRAINT IF EXISTS "FK_dang_ky_ca_lam_nhan_vien";
        `);
        
        // Xóa các cột cũ
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP COLUMN IF EXISTS "nhanVienMaNhanVien";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            DROP COLUMN IF EXISTS "nhanVienMaNhanVien";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            DROP COLUMN IF EXISTS "nhanVienMaNhanVien";
        `);
        
        // 6. Thêm foreign key constraints mới
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD CONSTRAINT "FK_don_dat_phong_user" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            ADD CONSTRAINT "FK_theo_doi_ca_lam_user" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            ADD CONSTRAINT "FK_dang_ky_ca_lam_user" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL;
        `);
        
        // 7. Thêm foreign key cho chucVu trong user
        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD CONSTRAINT "FK_user_chuc_vu" 
            FOREIGN KEY ("chucVuMaChucVu") REFERENCES "chuc_vu"("maChucVu") ON DELETE SET NULL;
        `);
        
        // 8. Xóa bảng nhan_vien (sau khi đã gộp dữ liệu)
        await queryRunner.query(`DROP TABLE IF EXISTS "nhan_vien"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Tạo lại bảng nhan_vien
        await queryRunner.query(`
            CREATE TABLE "nhan_vien" (
                "maNhanVien" character varying NOT NULL,
                "chucVuMaChucVu" character varying,
                "ten" character varying(50) NOT NULL,
                "ngaySinh" DATE NOT NULL,
                "gioiTinh" character varying CHECK ("gioiTinh" IN ('Nam', 'Nữ')) NOT NULL,
                "diaChi" character varying(200) NOT NULL,
                "email" character varying(50) NOT NULL,
                "sdt" character varying(10) NOT NULL,
                "maSoThue" character varying(50) NOT NULL,
                "ngayBatDau" DATE NOT NULL,
                "ngayNghi" DATE,
                "hinhAnh" character varying,
                CONSTRAINT "PK_nhan_vien" PRIMARY KEY ("maNhanVien")
            )
        `);
        
        // Khôi phục dữ liệu từ user về nhan_vien
        await queryRunner.query(`
            INSERT INTO "nhan_vien" (
                "maNhanVien", "chucVuMaChucVu", "ten", "ngaySinh", "gioiTinh",
                "diaChi", "email", "sdt", "maSoThue", "ngayBatDau", "ngayNghi", "hinhAnh"
            )
            SELECT 
                "maNhanVien", "chucVuMaChucVu", "ten", "ngaySinh", "gioiTinh",
                "diaChi", "gmail" as "email", "soDienThoai" as "sdt", 
                "maSoThue", "ngayBatDau", "ngayNghi", "hinhAnh"
            FROM "user"
            WHERE "maNhanVien" IS NOT NULL
        `);
        
        // Khôi phục foreign keys cũ
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD COLUMN "nhanVienMaNhanVien" character varying;
        `);
        
        await queryRunner.query(`
            UPDATE "don_dat_phong" ddp
            SET "nhanVienMaNhanVien" = u."maNhanVien"
            FROM "user" u
            WHERE ddp."userId" = u.id AND u."maNhanVien" IS NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            ADD COLUMN "nhanVienMaNhanVien" character varying;
        `);
        
        await queryRunner.query(`
            UPDATE "theo_doi_ca_lam" tdcl
            SET "nhanVienMaNhanVien" = u."maNhanVien"
            FROM "user" u
            WHERE tdcl."userId" = u.id AND u."maNhanVien" IS NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            ADD COLUMN "nhanVienMaNhanVien" character varying;
        `);
        
        await queryRunner.query(`
            UPDATE "dang_ky_ca_lam" dkcl
            SET "nhanVienMaNhanVien" = u."maNhanVien"
            FROM "user" u
            WHERE dkcl."userId" = u.id AND u."maNhanVien" IS NOT NULL
        `);
        
        // Xóa foreign keys mới
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP CONSTRAINT IF EXISTS "FK_don_dat_phong_user";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            DROP CONSTRAINT IF EXISTS "FK_theo_doi_ca_lam_user";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            DROP CONSTRAINT IF EXISTS "FK_dang_ky_ca_lam_user";
        `);
        
        // Xóa các cột mới
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP COLUMN IF EXISTS "userId";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            DROP COLUMN IF EXISTS "userId";
        `);
        
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            DROP COLUMN IF EXISTS "userId";
        `);
        
        // Thêm lại foreign keys cũ
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD CONSTRAINT "FK_don_dat_phong_nhan_vien" 
            FOREIGN KEY ("nhanVienMaNhanVien") REFERENCES "nhan_vien"("maNhanVien") ON DELETE SET NULL;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "theo_doi_ca_lam" 
            ADD CONSTRAINT "FK_theo_doi_ca_lam_nhan_vien" 
            FOREIGN KEY ("nhanVienMaNhanVien") REFERENCES "nhan_vien"("maNhanVien") ON DELETE SET NULL;
        `);
        
        await queryRunner.query(`
            ALTER TABLE "dang_ky_ca_lam" 
            ADD CONSTRAINT "FK_dang_ky_ca_lam_nhan_vien" 
            FOREIGN KEY ("nhanVienMaNhanVien") REFERENCES "nhan_vien"("maNhanVien") ON DELETE SET NULL;
        `);
        
        // Xóa foreign key chucVu từ user
        await queryRunner.query(`
            ALTER TABLE "user" 
            DROP CONSTRAINT IF EXISTS "FK_user_chuc_vu";
        `);
        
        // Xóa các cột đã thêm vào user
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "hinhAnh"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "ngayNghi"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "ngayBatDau"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "maSoThue"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "chucVuMaChucVu"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "diaChi"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "gioiTinh"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "ngaySinh"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "ten"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "maNhanVien"`);
        
        // Xóa unique constraint
        await queryRunner.query(`DROP INDEX IF EXISTS "UQ_user_maNhanVien"`);
    }
}

