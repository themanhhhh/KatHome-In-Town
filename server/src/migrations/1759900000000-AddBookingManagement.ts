import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingManagement1759900000000 implements MigrationInterface {
    name = 'AddBookingManagement1759900000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add fields to DonDatPhong
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "customerEmail" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "customerPhone" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "customerName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "bookingSource" character varying(50) DEFAULT 'website'`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "totalAmount" DECIMAL(10,2)`);

        // Add fields to ChiTietDonDatPhong
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" ADD "checkInDate" TIMESTAMP NOT NULL DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" ADD "checkOutDate" TIMESTAMP NOT NULL DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" ADD "donGia" DECIMAL(10,2)`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" ADD "thanhTien" DECIMAL(10,2)`);
        await queryRunner.query(`
            CREATE TYPE "chi_tiet_don_dat_phong_trangthai_enum" AS ENUM('reserved', 'paid', 'checked_in', 'checked_out', 'cancelled')
        `);
        await queryRunner.query(`
            ALTER TABLE "chi_tiet_don_dat_phong" 
            ADD "trangThai" "chi_tiet_don_dat_phong_trangthai_enum" DEFAULT 'reserved'
        `);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" ADD "actualCheckInTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" ADD "actualCheckOutTime" TIMESTAMP`);

        // Create index for better query performance
        await queryRunner.query(`
            CREATE INDEX "IDX_chi_tiet_status_dates" 
            ON "chi_tiet_don_dat_phong" ("trangThai", "checkInDate", "checkOutDate")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index
        await queryRunner.query(`DROP INDEX "IDX_chi_tiet_status_dates"`);

        // Remove fields from ChiTietDonDatPhong
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" DROP COLUMN "actualCheckOutTime"`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" DROP COLUMN "actualCheckInTime"`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" DROP COLUMN "trangThai"`);
        await queryRunner.query(`DROP TYPE "chi_tiet_don_dat_phong_trangthai_enum"`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" DROP COLUMN "thanhTien"`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" DROP COLUMN "donGia"`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" DROP COLUMN "checkOutDate"`);
        await queryRunner.query(`ALTER TABLE "chi_tiet_don_dat_phong" DROP COLUMN "checkInDate"`);

        // Remove fields from DonDatPhong
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "bookingSource"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "customerName"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "customerPhone"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "customerEmail"`);
    }
}

