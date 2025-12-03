import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBankTransferToPaymentMethod1771400000000 implements MigrationInterface {
    name = 'AddBankTransferToPaymentMethod1771400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if enum type exists for don_dat_phong.phuongThucThanhToan
        const enumExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type 
                WHERE typname = 'don_dat_phong_phuongThucThanhToan_enum'
            )
        `);

        if (enumExists[0] && enumExists[0].exists) {
            // Check if 'Bank-Transfer' already exists in the enum
            const valueExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumlabel = 'Bank-Transfer' 
                    AND enumtypid = (
                        SELECT oid FROM pg_type WHERE typname = 'don_dat_phong_phuongThucThanhToan_enum'
                    )
                )
            `);

            if (!valueExists[0].exists) {
                await queryRunner.query(`
                    ALTER TYPE "don_dat_phong_phuongThucThanhToan_enum"
                    ADD VALUE 'Bank-Transfer'
                `);
                console.log("✅ Added 'Bank-Transfer' to don_dat_phong_phuongThucThanhToan_enum");
            } else {
                console.log("✅ 'Bank-Transfer' already exists in don_dat_phong_phuongThucThanhToan_enum");
            }
        } else {
            // Column likely uses VARCHAR instead of enum type
            console.log("⚠️ Enum type 'don_dat_phong_phuongThucThanhToan_enum' does not exist. Skipping enum update.");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // PostgreSQL does not support removing enum values directly.
        // To revert this change you'd need to recreate the enum without the value and update the column.
        console.log("⚠️ Cannot remove enum value in PostgreSQL via down(). Manual intervention required if you need to revert.");
    }
}
