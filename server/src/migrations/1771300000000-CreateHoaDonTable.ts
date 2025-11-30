import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHoaDonTable1771300000000 implements MigrationInterface {
    name = 'CreateHoaDonTable1771300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create hoa_don table
        await queryRunner.query(`
            CREATE TABLE "hoa_don" (
                "id" SERIAL NOT NULL,
                "maHoaDon" character varying(50) NOT NULL,
                "tongTien" DECIMAL(10,2) NOT NULL,
                "phuongThucThanhToan" character varying(50) NOT NULL,
                "paymentRef" character varying(255),
                "ngayThanhToan" TIMESTAMP NOT NULL,
                "ghiChu" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "donDatPhongMaDatPhong" character varying,
                "nhanVienId" uuid,
                CONSTRAINT "UQ_hoa_don_maHoaDon" UNIQUE ("maHoaDon"),
                CONSTRAINT "PK_hoa_don" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key to don_dat_phong
        await queryRunner.query(`
            ALTER TABLE "hoa_don" 
            ADD CONSTRAINT "FK_hoa_don_donDatPhong" 
            FOREIGN KEY ("donDatPhongMaDatPhong") 
            REFERENCES "don_dat_phong"("maDatPhong") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Add foreign key to user (nhanVien)
        await queryRunner.query(`
            ALTER TABLE "hoa_don" 
            ADD CONSTRAINT "FK_hoa_don_nhanVien" 
            FOREIGN KEY ("nhanVienId") 
            REFERENCES "user"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        // Create index for better query performance
        await queryRunner.query(`
            CREATE INDEX "IDX_hoa_don_maHoaDon" ON "hoa_don" ("maHoaDon")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_hoa_don_donDatPhong" ON "hoa_don" ("donDatPhongMaDatPhong")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_hoa_don_ngayThanhToan" ON "hoa_don" ("ngayThanhToan")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_hoa_don_ngayThanhToan"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_hoa_don_donDatPhong"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_hoa_don_maHoaDon"`);

        // Drop foreign keys
        await queryRunner.query(`ALTER TABLE "hoa_don" DROP CONSTRAINT IF EXISTS "FK_hoa_don_nhanVien"`);
        await queryRunner.query(`ALTER TABLE "hoa_don" DROP CONSTRAINT IF EXISTS "FK_hoa_don_donDatPhong"`);

        // Drop table
        await queryRunner.query(`DROP TABLE IF EXISTS "hoa_don"`);
    }
}

