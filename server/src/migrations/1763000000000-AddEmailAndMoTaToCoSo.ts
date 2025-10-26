import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailAndMoTaToCoSo1763000000000 implements MigrationInterface {
  name = 'AddEmailAndMoTaToCoSo1763000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add email column to co_so table
    await queryRunner.query(`ALTER TABLE "co_so" ADD COLUMN "email" varchar(100)`);
    
    // Add moTa column to co_so table
    await queryRunner.query(`ALTER TABLE "co_so" ADD COLUMN "moTa" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove moTa column
    await queryRunner.query(`ALTER TABLE "co_so" DROP COLUMN "moTa"`);
    
    // Remove email column
    await queryRunner.query(`ALTER TABLE "co_so" DROP COLUMN "email"`);
  }
}
