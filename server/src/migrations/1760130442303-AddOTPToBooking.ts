import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOTPToBooking1760130442303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add OTP fields to DonDatPhong table
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "otpCode" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "otpExpiry" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "isVerified" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove OTP fields from DonDatPhong table
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "otpExpiry"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "otpCode"`);
    }

}
