import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToUser1759388249913 implements MigrationInterface {
    name = 'AddAvatarToUser1759388249913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
