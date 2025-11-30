import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToBooking1771200000000 implements MigrationInterface {
    name = 'AddSoftDeleteToBooking1771200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add isDeleted and deletedAt columns for soft delete
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false
        `);
        
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP
        `);

        // Create index for better query performance when filtering deleted records
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_don_dat_phong_isDeleted" 
            ON "don_dat_phong"("isDeleted")
        `);
        
        console.log('✅ Added soft delete columns to booking table');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_don_dat_phong_isDeleted"
        `);
        
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP COLUMN IF EXISTS "deletedAt"
        `);
        
        await queryRunner.query(`
            ALTER TABLE "don_dat_phong" 
            DROP COLUMN IF EXISTS "isDeleted"
        `);
    }
}

