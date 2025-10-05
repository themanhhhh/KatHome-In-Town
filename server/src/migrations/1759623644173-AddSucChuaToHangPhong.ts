import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSucChuaToHangPhong1759623644173 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Thêm cột sucChua vào bảng hang_phong
        await queryRunner.query(`
            ALTER TABLE hang_phong 
            ADD COLUMN "sucChua" integer NOT NULL DEFAULT 2
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Xoá cột sucChua khỏi bảng hang_phong
        await queryRunner.query(`
            ALTER TABLE hang_phong 
            DROP COLUMN "sucChua"
        `);
    }
}

