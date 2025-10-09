import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageFieldsToEntities1759702000000 implements MigrationInterface {
    name = 'AddImageFieldsToEntities1759702000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add avatar field to User table
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
        
        // Add hinhAnh field to Phong table
        await queryRunner.query(`ALTER TABLE "phong" ADD "hinhAnh" character varying`);
        
        // Add hinhAnh field to HangPhong table
        await queryRunner.query(`ALTER TABLE "hang_phong" ADD "hinhAnh" character varying`);
        
        // Add hinhAnh field to CoSo table
        await queryRunner.query(`ALTER TABLE "co_so" ADD "hinhAnh" character varying`);
        
        // Add hinhAnh field to DichVu table
        await queryRunner.query(`ALTER TABLE "dich_vu" ADD "hinhAnh" character varying`);
        
        // Add hinhAnh field to NhanVien table
        await queryRunner.query(`ALTER TABLE "nhan_vien" ADD "hinhAnh" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove hinhAnh field from NhanVien table
        await queryRunner.query(`ALTER TABLE "nhan_vien" DROP COLUMN "hinhAnh"`);
        
        // Remove hinhAnh field from DichVu table
        await queryRunner.query(`ALTER TABLE "dich_vu" DROP COLUMN "hinhAnh"`);
        
        // Remove hinhAnh field from CoSo table
        await queryRunner.query(`ALTER TABLE "co_so" DROP COLUMN "hinhAnh"`);
        
        // Remove hinhAnh field from HangPhong table
        await queryRunner.query(`ALTER TABLE "hang_phong" DROP COLUMN "hinhAnh"`);
        
        // Remove hinhAnh field from Phong table
        await queryRunner.query(`ALTER TABLE "phong" DROP COLUMN "hinhAnh"`);
        
        // Remove avatar field from User table
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }
}
