import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserForAuth1759604625492 implements MigrationInterface {
    name = 'UpdateUserForAuth1759604625492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop avatar column if exists
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "avatar"`);
        
        // Add new columns for authentication
        await queryRunner.query(`ALTER TABLE "user" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationCode" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationCodeExpiry" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPasswordToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPasswordExpiry" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        
        // Add unique constraints
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_84c5acb9da31c0cee3c2bd25fd9" UNIQUE ("taiKhoan")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_4cfb5bd10f9926d7a37474a2944" UNIQUE ("gmail")`);
        
        // Alter column types instead of dropping and recreating
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "matKhau" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gmail" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "vaiTro" SET DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "vaiTro" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_4cfb5bd10f9926d7a37474a2944"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gmail"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gmail" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "matKhau"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "matKhau" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_84c5acb9da31c0cee3c2bd25fd9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPasswordExpiry"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPasswordToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationCodeExpiry"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationCode"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailVerified"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

}
