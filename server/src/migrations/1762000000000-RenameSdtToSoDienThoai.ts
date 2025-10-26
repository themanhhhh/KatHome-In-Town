import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameSdtToSoDienThoai1762000000000 implements MigrationInterface {
  name = 'RenameSdtToSoDienThoai1762000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename column from sdt to soDienThoai
    await queryRunner.query(`ALTER TABLE "co_so" RENAME COLUMN "sdt" TO "soDienThoai"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert column name from soDienThoai to sdt
    await queryRunner.query(`ALTER TABLE "co_so" RENAME COLUMN "soDienThoai" TO "sdt"`);
  }
}
