import {MigrationInterface, QueryRunner} from "typeorm";

export class FinishDateNullable1634480678565 implements MigrationInterface {
    name = 'FinishDateNullable1634480678565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "finishDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "finishDate" SET NOT NULL`);
    }

}
