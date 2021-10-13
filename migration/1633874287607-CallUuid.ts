import {MigrationInterface, QueryRunner} from "typeorm";

export class CallUuid1633874287607 implements MigrationInterface {
    name = 'CallUuid1633874287607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call" ADD "generatedCode" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call" DROP COLUMN "generatedCode"`);
    }

}
