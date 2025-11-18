import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabaseSchema1769000000000 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('🔄 Starting database schema update...');

        // ========== Ensure UUID extension exists ==========
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        console.log('✅ UUID extension checked');

        // ========== Verify and update ThongBao table ==========
        const thongBaoExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'thong_bao'
            )
        `);

        if (!thongBaoExists[0].exists) {
            console.log('⚠️  thong_bao table not found, creating...');
            await queryRunner.query(`
                CREATE TABLE "thong_bao" (
                    "maThongBao" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                    "khachHangMaKhachHang" VARCHAR NOT NULL,
                    "nguoiGuiId" UUID,
                    "tieuDe" VARCHAR(255) NOT NULL,
                    "noiDung" TEXT NOT NULL,
                    "loaiThongBao" VARCHAR(50) DEFAULT 'system',
                    "trangThai" VARCHAR(20) DEFAULT 'unread',
                    "daDoc" BOOLEAN DEFAULT false,
                    "ngayDoc" TIMESTAMP,
                    "ngayTao" TIMESTAMP DEFAULT now(),
                    "linkLienKet" VARCHAR(500),
                    "ghiChu" TEXT,
                    FOREIGN KEY ("khachHangMaKhachHang") REFERENCES "khach_hang"("maKhachHang") ON DELETE CASCADE,
                    FOREIGN KEY ("nguoiGuiId") REFERENCES "user"("id") ON DELETE SET NULL
                )
            `);
            console.log('✅ Created thong_bao table');
        } else {
            console.log('✅ thong_bao table already exists');
        }

        // ========== Ensure indexes exist for ThongBao ==========
        const indexes = [
            { name: 'idx_thong_bao_khach_hang', column: 'khachHangMaKhachHang' },
            { name: 'idx_thong_bao_trang_thai', column: 'trangThai' },
            { name: 'idx_thong_bao_da_doc', column: 'daDoc' }
        ];

        for (const idx of indexes) {
            const indexExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM pg_indexes 
                    WHERE schemaname = 'public' 
                    AND indexname = '${idx.name}'
                )
            `);

            if (!indexExists[0].exists) {
                await queryRunner.query(`
                    CREATE INDEX IF NOT EXISTS "${idx.name}" ON "thong_bao"("${idx.column}")
                `);
                console.log(`✅ Created index ${idx.name}`);
            }
        }

        // ========== Verify DanhGia table structure ==========
        const danhGiaExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'danh_gia'
            )
        `);

        if (danhGiaExists[0].exists) {
            // Check if phanHoi column exists
            const phanHoiExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'danh_gia' 
                    AND column_name = 'phanHoi'
                )
            `);

            if (!phanHoiExists[0].exists) {
                await queryRunner.query(`ALTER TABLE "danh_gia" ADD "phanHoi" TEXT`);
                console.log('✅ Added phanHoi column to danh_gia');
            }

            // Check if ngayPhanHoi column exists
            const ngayPhanHoiExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'danh_gia' 
                    AND column_name = 'ngayPhanHoi'
                )
            `);

            if (!ngayPhanHoiExists[0].exists) {
                await queryRunner.query(`ALTER TABLE "danh_gia" ADD "ngayPhanHoi" TIMESTAMP`);
                console.log('✅ Added ngayPhanHoi column to danh_gia');
            }
        }

        // ========== Verify KhieuNai table structure ==========
        const khieuNaiExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'khieu_nai'
            )
        `);

        if (khieuNaiExists[0].exists) {
            // Check for new columns
            const columnsToCheck = [
                { name: 'tieuDe', type: 'VARCHAR(255)' },
                { name: 'loaiKhieuNai', type: 'VARCHAR(50)' },
                { name: 'trangThai', type: 'VARCHAR(20)' },
                { name: 'phanHoi', type: 'TEXT' }
            ];

            for (const col of columnsToCheck) {
                const colExists = await queryRunner.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = 'khieu_nai' 
                        AND column_name = '${col.name}'
                    )
                `);

                if (!colExists[0].exists) {
                    await queryRunner.query(`ALTER TABLE "khieu_nai" ADD "${col.name}" ${col.type}`);
                    console.log(`✅ Added ${col.name} column to khieu_nai`);
                }
            }
        }

        // ========== Verify DonDatPhong table has all required columns ==========
        const donDatPhongExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'don_dat_phong'
            )
        `);

        if (donDatPhongExists[0].exists) {
            const bookingColumns = [
                { name: 'expiresAt', type: 'TIMESTAMP' },
                { name: 'version', type: 'INTEGER DEFAULT 0' },
                { name: 'basePrice', type: 'DECIMAL(10,2)' },
                { name: 'seasonalSurcharge', type: 'DECIMAL(10,2) DEFAULT 0' },
                { name: 'guestSurcharge', type: 'DECIMAL(10,2) DEFAULT 0' },
                { name: 'vatAmount', type: 'DECIMAL(10,2) DEFAULT 0' },
                { name: 'discount', type: 'DECIMAL(10,2) DEFAULT 0' },
                { name: 'promotionCode', type: 'VARCHAR(100)' },
                { name: 'paymentStatus', type: 'VARCHAR(50)' }
            ];

            for (const col of bookingColumns) {
                const colExists = await queryRunner.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = 'don_dat_phong' 
                        AND column_name = '${col.name}'
                    )
                `);

                if (!colExists[0].exists) {
                    await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "${col.name}" ${col.type}`);
                    console.log(`✅ Added ${col.name} column to don_dat_phong`);
                }
            }
        }

        // ========== Verify Phong table has all required columns ==========
        const phongExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'phong'
            )
        `);

        if (phongExists[0].exists) {
            const phongColumns = [
                { name: 'version', type: 'INTEGER DEFAULT 0' },
                { name: 'lockedUntil', type: 'TIMESTAMP' },
                { name: 'status', type: 'VARCHAR(50) DEFAULT \'available\'' }
            ];

            for (const col of phongColumns) {
                const colExists = await queryRunner.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = 'phong' 
                        AND column_name = '${col.name}'
                    )
                `);

                if (!colExists[0].exists) {
                    await queryRunner.query(`ALTER TABLE "phong" ADD "${col.name}" ${col.type}`);
                    console.log(`✅ Added ${col.name} column to phong`);
                }
            }
        }

        // ========== Verify User table has all required columns ==========
        const userExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'user'
            )
        `);

        if (userExists[0].exists) {
            const userColumns = [
                { name: 'isEmailVerified', type: 'BOOLEAN DEFAULT false' },
                { name: 'verificationCode', type: 'VARCHAR(6)' },
                { name: 'verificationCodeExpiry', type: 'TIMESTAMP' },
                { name: 'resetPasswordToken', type: 'VARCHAR' },
                { name: 'resetPasswordExpiry', type: 'TIMESTAMP' }
            ];

            for (const col of userColumns) {
                const colExists = await queryRunner.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_schema = 'public' 
                        AND table_name = 'user' 
                        AND column_name = '${col.name}'
                    )
                `);

                if (!colExists[0].exists) {
                    await queryRunner.query(`ALTER TABLE "user" ADD "${col.name}" ${col.type}`);
                    console.log(`✅ Added ${col.name} column to user`);
                }
            }
        }

        console.log('✅ Database schema update completed successfully!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This migration is idempotent and safe, so down migration is not needed
        // But we can add it for completeness
        console.log('⚠️  Down migration not implemented - this migration is idempotent');
    }
}

