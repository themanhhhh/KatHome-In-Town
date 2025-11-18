import { MigrationInterface, QueryRunner } from "typeorm";

export class MergeHangPhongDonGiaToPhong1765000000000 implements MigrationInterface {
    name = 'MergeHangPhongDonGiaToPhong1765000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Thêm các cột mới vào bảng phong
        await queryRunner.query(`ALTER TABLE "phong" ADD COLUMN "tenPhong" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "phong" ADD COLUMN "sucChua" integer DEFAULT 2`);
        await queryRunner.query(`ALTER TABLE "phong" ADD COLUMN "donGia4h" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "phong" ADD COLUMN "donGiaQuaDem" numeric(10,2)`);
        
        // 2. Cập nhật moTa để tăng độ dài
        await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "moTa" TYPE character varying(500)`);
        
        // 3. Chuyển dữ liệu từ hang_phong và don_gia sang phong
        // Cập nhật tenPhong, sucChua từ hang_phong
        await queryRunner.query(`
            UPDATE "phong" p
            SET 
                "tenPhong" = COALESCE(hp."tenHangPhong", p."moTa"),
                "sucChua" = COALESCE(hp."sucChua", 2)
            FROM "hang_phong" hp
            WHERE p."hangPhongMaHangPhong" = hp."maHangPhong"
        `);
        
        // Cập nhật đơn giá từ don_gia
        await queryRunner.query(`
            UPDATE "phong" p
            SET 
                "donGia4h" = COALESCE(dg4h."donGia", 0),
                "donGiaQuaDem" = COALESCE(dgqd."donGia", 0)
            FROM "hang_phong" hp
            LEFT JOIN "don_gia" dg4h ON dg4h."maHangPhong" = hp."maHangPhong" AND dg4h."donViTinh" = '4h'
            LEFT JOIN "don_gia" dgqd ON dgqd."maHangPhong" = hp."maHangPhong" AND dgqd."donViTinh" = 'quaDem'
            WHERE p."hangPhongMaHangPhong" = hp."maHangPhong"
        `);
        
        // Set default values cho các phòng không có dữ liệu
        await queryRunner.query(`
            UPDATE "phong"
            SET 
                "tenPhong" = COALESCE("tenPhong", "moTa", 'Phòng'),
                "sucChua" = COALESCE("sucChua", 2),
                "donGia4h" = COALESCE("donGia4h", 500000),
                "donGiaQuaDem" = COALESCE("donGiaQuaDem", 1000000)
            WHERE "tenPhong" IS NULL OR "sucChua" IS NULL OR "donGia4h" IS NULL OR "donGiaQuaDem" IS NULL
        `);
        
        // 4. Đặt NOT NULL cho các cột mới
        await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "tenPhong" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "sucChua" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "donGia4h" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "donGiaQuaDem" SET NOT NULL`);
        
        // 5. Xóa foreign key constraint với hang_phong
        await queryRunner.query(`
            ALTER TABLE "phong" 
            DROP CONSTRAINT IF EXISTS "FK_phong_hang_phong"
        `);
        
        // 6. Xóa cột hangPhongMaHangPhong
        await queryRunner.query(`ALTER TABLE "phong" DROP COLUMN IF EXISTS "hangPhongMaHangPhong"`);
        
        // 7. Xóa các bảng không còn sử dụng
        await queryRunner.query(`DROP TABLE IF EXISTS "don_gia"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "hang_phong"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Tạo lại bảng hang_phong
        await queryRunner.query(`
            CREATE TABLE "hang_phong" (
                "maHangPhong" character varying NOT NULL,
                "tenHangPhong" character varying(50) NOT NULL,
                "sucChua" integer NOT NULL DEFAULT 2,
                "moTa" character varying(200) NOT NULL,
                "hinhAnh" character varying,
                CONSTRAINT "PK_hang_phong" PRIMARY KEY ("maHangPhong")
            )
        `);
        
        // Tạo lại bảng don_gia
        await queryRunner.query(`
            CREATE TABLE "don_gia" (
                "maHangPhong" character varying NOT NULL,
                "donViTinh" character varying NOT NULL,
                "donGia" numeric NOT NULL,
                CONSTRAINT "PK_don_gia" PRIMARY KEY ("maHangPhong", "donViTinh"),
                CONSTRAINT "FK_don_gia_hang_phong" FOREIGN KEY ("maHangPhong") 
                    REFERENCES "hang_phong"("maHangPhong") ON DELETE CASCADE
            )
        `);
        
        // Thêm lại cột hangPhongMaHangPhong
        await queryRunner.query(`ALTER TABLE "phong" ADD COLUMN "hangPhongMaHangPhong" character varying`);
        
        // Khôi phục dữ liệu (tạo hang_phong từ dữ liệu phong)
        await queryRunner.query(`
            INSERT INTO "hang_phong" ("maHangPhong", "tenHangPhong", "sucChua", "moTa", "hinhAnh")
            SELECT DISTINCT
                'HP' || ROW_NUMBER() OVER (ORDER BY "tenPhong") as "maHangPhong",
                "tenPhong" as "tenHangPhong",
                "sucChua",
                "moTa",
                "hinhAnh"
            FROM "phong"
            ON CONFLICT ("maHangPhong") DO NOTHING
        `);
        
        // Khôi phục don_gia
        await queryRunner.query(`
            INSERT INTO "don_gia" ("maHangPhong", "donViTinh", "donGia")
            SELECT DISTINCT
                hp."maHangPhong",
                '4h' as "donViTinh",
                p."donGia4h" as "donGia"
            FROM "phong" p
            CROSS JOIN LATERAL (
                SELECT "maHangPhong" 
                FROM "hang_phong" 
                WHERE "tenHangPhong" = p."tenPhong" 
                LIMIT 1
            ) hp
            UNION ALL
            SELECT DISTINCT
                hp."maHangPhong",
                'quaDem' as "donViTinh",
                p."donGiaQuaDem" as "donGia"
            FROM "phong" p
            CROSS JOIN LATERAL (
                SELECT "maHangPhong" 
                FROM "hang_phong" 
                WHERE "tenHangPhong" = p."tenPhong" 
                LIMIT 1
            ) hp
            ON CONFLICT ("maHangPhong", "donViTinh") DO NOTHING
        `);
        
        // Cập nhật hangPhongMaHangPhong
        await queryRunner.query(`
            UPDATE "phong" p
            SET "hangPhongMaHangPhong" = hp."maHangPhong"
            FROM "hang_phong" hp
            WHERE hp."tenHangPhong" = p."tenPhong"
        `);
        
        // Thêm lại foreign key
        await queryRunner.query(`
            ALTER TABLE "phong" 
            ADD CONSTRAINT "FK_phong_hang_phong" 
            FOREIGN KEY ("hangPhongMaHangPhong") 
            REFERENCES "hang_phong"("maHangPhong") ON DELETE SET NULL
        `);
        
        // Xóa các cột mới
        await queryRunner.query(`ALTER TABLE "phong" DROP COLUMN IF EXISTS "donGiaQuaDem"`);
        await queryRunner.query(`ALTER TABLE "phong" DROP COLUMN IF EXISTS "donGia4h"`);
        await queryRunner.query(`ALTER TABLE "phong" DROP COLUMN IF EXISTS "sucChua"`);
        await queryRunner.query(`ALTER TABLE "phong" DROP COLUMN IF EXISTS "tenPhong"`);
        
        // Khôi phục độ dài moTa
        await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "moTa" TYPE character varying(200)`);
    }
}

