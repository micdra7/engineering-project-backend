import {MigrationInterface, QueryRunner} from "typeorm";

export class FilePathInGame1634840988758 implements MigrationInterface {
    name = 'FilePathInGame1634840988758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "filepath" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "filepath"`);
    }

}
