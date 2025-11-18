import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingLockAndPricing1766000000000 implements MigrationInterface {
    name = 'AddBookingLockAndPricing1766000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new fields to don_dat_phong table
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "version" INTEGER DEFAULT 0 NOT NULL,
            ADD COLUMN IF NOT EXISTS "basePrice" DECIMAL(10,2),
            ADD COLUMN IF NOT EXISTS "seasonalSurcharge" DECIMAL(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "guestSurcharge" DECIMAL(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "vatAmount" DECIMAL(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "discount" DECIMAL(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "promotionCode" VARCHAR(100)
        `);

        // Add new fields to phong table
        await queryRunner.query(`
            ALTER TABLE "phong" 
            ADD COLUMN IF NOT EXISTS "version" INTEGER DEFAULT 0 NOT NULL,
            ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "status" VARCHAR(50) DEFAULT 'available' NOT NULL
        `);

        console.log('✅ Added booking lock and pricing fields');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove fields from don_dat_phong
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP COLUMN IF EXISTS "expiresAt",
            DROP COLUMN IF EXISTS "version",
            DROP COLUMN IF EXISTS "basePrice",
            DROP COLUMN IF EXISTS "seasonalSurcharge",
            DROP COLUMN IF EXISTS "guestSurcharge",
            DROP COLUMN IF EXISTS "vatAmount",
            DROP COLUMN IF EXISTS "discount",
            DROP COLUMN IF EXISTS "promotionCode"
        `);

        // Remove fields from phong
        await queryRunner.query(`
            ALTER TABLE "phong" 
            DROP COLUMN IF EXISTS "version",
            DROP COLUMN IF EXISTS "lockedUntil",
            DROP COLUMN IF EXISTS "status"
        `);

        console.log('✅ Removed booking lock and pricing fields');
    }
}

