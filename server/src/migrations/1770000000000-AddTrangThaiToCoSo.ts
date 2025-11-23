import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrangThaiToCoSo1770000000000 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('🔄 Adding trangThai column to co_so table...');

        // Check if column already exists
        const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'co_so'
                AND column_name = 'trangThai'
            )
        `);

        if (!columnExists[0].exists) {
            await queryRunner.query(`
                ALTER TABLE "co_so" 
                ADD COLUMN "trangThai" VARCHAR(20) DEFAULT 'active'
            `);
            
            // Update existing records to have 'active' status
            await queryRunner.query(`
                UPDATE "co_so" 
                SET "trangThai" = 'active' 
                WHERE "trangThai" IS NULL
            `);
            
            console.log('✅ Added trangThai column to co_so table');
        } else {
            console.log('✅ trangThai column already exists in co_so table');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('🔄 Removing trangThai column from co_so table...');
        
        const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'co_so'
                AND column_name = 'trangThai'
            )
        `);

        if (columnExists[0].exists) {
            await queryRunner.query(`
                ALTER TABLE "co_so" 
                DROP COLUMN "trangThai"
            `);
            console.log('✅ Removed trangThai column from co_so table');
        }
    }
}

