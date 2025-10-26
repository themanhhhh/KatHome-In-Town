import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailAndMoTaToCoSo1764000000000 implements MigrationInterface {
  name = 'AddEmailAndMoTaToCoSo1764000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if email column exists, if not add it
    const emailColumnExists = await queryRunner.hasColumn('co_so', 'email');
    if (!emailColumnExists) {
      await queryRunner.query(`ALTER TABLE "co_so" ADD COLUMN "email" varchar(100)`);
    }
    
    // Check if moTa column exists, if not add it
    const moTaColumnExists = await queryRunner.hasColumn('co_so', 'moTa');
    if (!moTaColumnExists) {
      await queryRunner.query(`ALTER TABLE "co_so" ADD COLUMN "moTa" text`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove moTa column if exists
    const moTaColumnExists = await queryRunner.hasColumn('co_so', 'moTa');
    if (moTaColumnExists) {
      await queryRunner.query(`ALTER TABLE "co_so" DROP COLUMN "moTa"`);
    }
    
    // Remove email column if exists
    const emailColumnExists = await queryRunner.hasColumn('co_so', 'email');
    if (emailColumnExists) {
      await queryRunner.query(`ALTER TABLE "co_so" DROP COLUMN "email"`);
    }
  }
}
