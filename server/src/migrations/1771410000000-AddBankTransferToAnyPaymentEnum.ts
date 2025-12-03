import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBankTransferToAnyPaymentEnum1771410000000 implements MigrationInterface {
    name = 'AddBankTransferToAnyPaymentEnum1771410000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Find enum types related to the phuongThucThanhToan column on don_dat_phong
        const types: Array<{ typname: string }> = await queryRunner.query(`
            SELECT typname FROM pg_type
            WHERE typname ILIKE 'don_dat_phong%phuong%thanh%enum'
        `);

        if (!types || types.length === 0) {
            console.log("⚠️ No matching enum type found for don_dat_phong phuongThucThanhToan. Skipping.");
            return;
        }

        for (const t of types) {
            const typname = t.typname;

            // Check if value already exists
            const exists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT 1 FROM pg_enum
                    WHERE enumlabel = 'Bank-Transfer' AND enumtypid = (
                        SELECT oid FROM pg_type WHERE typname = $1
                    )
                )
            `, [typname]);

            if (exists && exists[0] && exists[0].exists) {
                console.log(`✅ 'Bank-Transfer' already exists in enum ${typname}`);
                continue;
            }

            // Add the enum value
            try {
                await queryRunner.query(`ALTER TYPE "${typname}" ADD VALUE 'Bank-Transfer'`);
                console.log(`✅ Added 'Bank-Transfer' to enum ${typname}`);
            } catch (err) {
                console.error(`Failed to add 'Bank-Transfer' to enum ${typname}:`, err);
                // Rethrow to fail the migration so the issue can be fixed manually
                throw err;
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Removing enum values is non-trivial in PostgreSQL; manual intervention required if needed.
        console.log("⚠️ Cannot remove enum value via down(). Manual intervention required to revert this migration.");
    }
}
