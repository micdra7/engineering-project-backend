import {MigrationInterface, QueryRunner} from "typeorm";

export class updateResultType1634996416390 implements MigrationInterface {
    name = 'updateResultType1634996416390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_result" DROP COLUMN "result"`);
        await queryRunner.query(`ALTER TABLE "game_result" ADD "result" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_result" DROP COLUMN "result"`);
        await queryRunner.query(`ALTER TABLE "game_result" ADD "result" json NOT NULL`);
    }

}
