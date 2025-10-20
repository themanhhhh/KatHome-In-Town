import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixReportIdDefault1761200000000 implements MigrationInterface {
  name = 'FixReportIdDefault1761200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query('ALTER TABLE "Report" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "Report" ALTER COLUMN "id" DROP DEFAULT');
  }
}

