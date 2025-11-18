import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThongBao1768000000000 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create ThongBao (Notifications) table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "thong_bao" (
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

        // Create index for faster queries
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_thong_bao_khach_hang" ON "thong_bao"("khachHangMaKhachHang")
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_thong_bao_trang_thai" ON "thong_bao"("trangThai")
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_thong_bao_da_doc" ON "thong_bao"("daDoc")
        `);

        console.log('✅ Created thong_bao table with indexes');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "thong_bao" CASCADE`);
        console.log('✅ Dropped thong_bao table');
    }
}

