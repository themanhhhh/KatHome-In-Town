import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTimeoutToBooking1771100000000 implements MigrationInterface {
    name = 'AddPaymentTimeoutToBooking1771100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add paymentTimeoutAt field to track 10-minute payment deadline
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD COLUMN IF NOT EXISTS "paymentTimeoutAt" TIMESTAMP
        `);
        
        console.log('✅ Added paymentTimeoutAt field to booking table');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP COLUMN IF EXISTS "paymentTimeoutAt"
        `);
    }
}


