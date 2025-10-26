import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailAndMoTaToCoSo1765000000000 implements MigrationInterface {
  name = 'AddEmailAndMoTaToCoSo1765000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if email column exists, if not add it
    const emailColumnExists = await queryRunner.hasColumn('co_so', 'email');
    if (!emailColumnExists) {
      await queryRunner.query(`ALTER TABLE "co_so" ADD COLUMN "email" varchar(100)`);
      console.log('✅ Added email column to co_so table');
    } else {
      console.log('ℹ️ Email column already exists in co_so table');
    }
    
    // Check if moTa column exists, if not add it
    const moTaColumnExists = await queryRunner.hasColumn('co_so', 'moTa');
    if (!moTaColumnExists) {
      await queryRunner.query(`ALTER TABLE "co_so" ADD COLUMN "moTa" text`);
      console.log('✅ Added moTa column to co_so table');
    } else {
      console.log('ℹ️ moTa column already exists in co_so table');
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
