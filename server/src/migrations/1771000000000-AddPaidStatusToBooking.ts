import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaidStatusToBooking1771000000000 implements MigrationInterface {
    name = 'AddPaidStatusToBooking1771000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if enum type exists before trying to add value
        const enumExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type 
                WHERE typname = 'don_dat_phong_trangThai_enum'
            )
        `);

        if (enumExists[0].exists) {
            // Check if 'PA' value already exists in the enum
            const paExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumlabel = 'PA' 
                    AND enumtypid = (
                        SELECT oid FROM pg_type WHERE typname = 'don_dat_phong_trangThai_enum'
                    )
                )
            `);

            if (!paExists[0].exists) {
                // Add 'PA' (Paid) status to the enum
                await queryRunner.query(`
                    ALTER TYPE "don_dat_phong_trangThai_enum" 
                    ADD VALUE 'PA'
                `);
                console.log('✅ Added PA (Paid) status to booking enum');
            } else {
                console.log('✅ PA status already exists in enum');
            }
        } else {
            // Enum type doesn't exist, likely using VARCHAR instead
            // This is fine - the entity definition already includes 'PA'
            console.log('⚠️ Enum type does not exist. Column likely uses VARCHAR. Skipping enum update.');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: PostgreSQL doesn't support removing enum values directly
        // We would need to recreate the enum without 'PA' and update all records
        // For now, we'll leave it as a no-op
        console.log('⚠️ Cannot remove enum value in PostgreSQL. Manual intervention required.');
    }
}

