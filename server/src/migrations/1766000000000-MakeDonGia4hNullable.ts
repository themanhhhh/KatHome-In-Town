import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDonGia4hNullable1766000000000 implements MigrationInterface {
  name = 'MakeDonGia4hNullable1766000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cho phép donGia4h được null (phù hợp với RoomForm ở admin hiện tại không gửi trường này)
    await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "donGia4h" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Đặt lại NOT NULL cho donGia4h, đồng thời set giá trị mặc định cho các bản ghi null để tránh lỗi
    await queryRunner.query(`
      UPDATE "phong"
      SET "donGia4h" = COALESCE("donGia4h", 0)
      WHERE "donGia4h" IS NULL
    `);
    await queryRunner.query(`ALTER TABLE "phong" ALTER COLUMN "donGia4h" SET NOT NULL`);
  }
}


