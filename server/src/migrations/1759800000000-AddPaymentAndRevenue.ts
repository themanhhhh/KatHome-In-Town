import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentAndRevenue1759800000000 implements MigrationInterface {
    name = 'AddPaymentAndRevenue1759800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add payment fields to DonDatPhong table
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "paymentStatus" character varying(50) DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "paymentMethod" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "paymentRef" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "paidAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" ADD "totalPaid" DECIMAL(10,2)`);

        // Create Revenue table
        await queryRunner.query(`
            CREATE TABLE "revenue" (
                "id" SERIAL NOT NULL,
                "amount" DECIMAL(10,2) NOT NULL,
                "paymentMethod" character varying(50) NOT NULL,
                "paymentDate" TIMESTAMP NOT NULL,
                "paymentRef" character varying(255),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "donDatPhongMaDatPhong" character varying,
                CONSTRAINT "PK_revenue" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "revenue" 
            ADD CONSTRAINT "FK_revenue_donDatPhong" 
            FOREIGN KEY ("donDatPhongMaDatPhong") 
            REFERENCES "don_dat_phong"("maDatPhong") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop Revenue table
        await queryRunner.query(`ALTER TABLE "revenue" DROP CONSTRAINT "FK_revenue_donDatPhong"`);
        await queryRunner.query(`DROP TABLE "revenue"`);

        // Remove payment fields from DonDatPhong table
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "totalPaid"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "paidAt"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "paymentRef"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`ALTER TABLE "don_dat_phong" DROP COLUMN "paymentStatus"`);
    }
}

