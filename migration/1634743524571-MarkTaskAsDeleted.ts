import {MigrationInterface, QueryRunner} from "typeorm";

export class MarkTaskAsDeleted1634743524571 implements MigrationInterface {
    name = 'MarkTaskAsDeleted1634743524571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "isDeleted" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "isDeleted"`);
    }

}
