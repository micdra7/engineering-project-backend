import {MigrationInterface, QueryRunner} from "typeorm";

export class isDoneNullable1634233741374 implements MigrationInterface {
    name = 'isDoneNullable1634233741374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "isDone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "isDone" SET NOT NULL`);
    }

}
