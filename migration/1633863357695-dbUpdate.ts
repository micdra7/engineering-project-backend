import {MigrationInterface, QueryRunner} from "typeorm";

export class dbUpdate1633863357695 implements MigrationInterface {
    name = 'dbUpdate1633863357695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "finishDate" TIMESTAMP NOT NULL, "isDone" boolean NOT NULL, "parentTaskId" integer, "taskListId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "workspaceId" integer, CONSTRAINT "PK_e9f70d01f59395c1dfdc633ae37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_data" ("id" SERIAL NOT NULL, "data" json NOT NULL, "gameId" integer, CONSTRAINT "PK_a9893e619362ce1bb2d616f4390" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_result" ("id" SERIAL NOT NULL, "result" json NOT NULL, "createdAt" TIMESTAMP NOT NULL, "gameId" integer, "userId" integer, CONSTRAINT "PK_0f05afdea1542af63c3027f7534" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "workspaceId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_workspaces" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "role" integer NOT NULL, "workspaceId" integer NOT NULL, CONSTRAINT "PK_3c26b2f35801149e8f0af2e4fb0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "filePath" character varying NOT NULL, "sendTime" TIMESTAMP NOT NULL, "userId" integer, "chatroomId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chatroom" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_1e5ce0a999152e29952194d01ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_chatrooms" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "chatroomId" integer NOT NULL, CONSTRAINT "PK_b35af7c7a0e632bde96954ae18d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "passwordHash" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "call" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "finishDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_tasks_task" ("userId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_5c112b153701f554843915f643f" PRIMARY KEY ("userId", "taskId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1fb6a986133f8f6cafb3d4fb31" ON "user_tasks_task" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9bcb8e9773d79c9874a61f79c3" ON "user_tasks_task" ("taskId") `);
        await queryRunner.query(`CREATE TABLE "user_calls_call" ("userId" integer NOT NULL, "callId" integer NOT NULL, CONSTRAINT "PK_6fa8b47e76439bff4cab2b03605" PRIMARY KEY ("userId", "callId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b188d190c3c80ea714346049e3" ON "user_calls_call" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d3d2362ee72d80b5bc0ff86d7" ON "user_calls_call" ("callId") `);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_8bf6d736c49d48d91691ea0dfe5" FOREIGN KEY ("parentTaskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_list" ADD CONSTRAINT "FK_327c552af9c4c1848240c88a984" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_data" ADD CONSTRAINT "FK_8854ee113e5b5d9c43ff9ee1c8b" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_result" ADD CONSTRAINT "FK_52bde66db56be3188de670ff5c3" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_result" ADD CONSTRAINT "FK_942f4ae6957d9ae2495d278f626" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_dee786f5a3576f64e3123ef1ab6" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspaces" ADD CONSTRAINT "FK_a9eab88a60b4f0314575d26ae47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspaces" ADD CONSTRAINT "FK_465cb7a34626136bc14f5405ba7" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c7b8f680d6902deef6b3347322c" FOREIGN KEY ("chatroomId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms" ADD CONSTRAINT "FK_1d36da5531ff23d5002cf9e6b0e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms" ADD CONSTRAINT "FK_31e6d3bcf435ed49c795d2ceaca" FOREIGN KEY ("chatroomId") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tasks_task" ADD CONSTRAINT "FK_1fb6a986133f8f6cafb3d4fb31e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_tasks_task" ADD CONSTRAINT "FK_9bcb8e9773d79c9874a61f79c3d" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_calls_call" ADD CONSTRAINT "FK_b188d190c3c80ea714346049e3d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_calls_call" ADD CONSTRAINT "FK_4d3d2362ee72d80b5bc0ff86d7d" FOREIGN KEY ("callId") REFERENCES "call"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_calls_call" DROP CONSTRAINT "FK_4d3d2362ee72d80b5bc0ff86d7d"`);
        await queryRunner.query(`ALTER TABLE "user_calls_call" DROP CONSTRAINT "FK_b188d190c3c80ea714346049e3d"`);
        await queryRunner.query(`ALTER TABLE "user_tasks_task" DROP CONSTRAINT "FK_9bcb8e9773d79c9874a61f79c3d"`);
        await queryRunner.query(`ALTER TABLE "user_tasks_task" DROP CONSTRAINT "FK_1fb6a986133f8f6cafb3d4fb31e"`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms" DROP CONSTRAINT "FK_31e6d3bcf435ed49c795d2ceaca"`);
        await queryRunner.query(`ALTER TABLE "user_chatrooms" DROP CONSTRAINT "FK_1d36da5531ff23d5002cf9e6b0e"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c7b8f680d6902deef6b3347322c"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "user_workspaces" DROP CONSTRAINT "FK_465cb7a34626136bc14f5405ba7"`);
        await queryRunner.query(`ALTER TABLE "user_workspaces" DROP CONSTRAINT "FK_a9eab88a60b4f0314575d26ae47"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_dee786f5a3576f64e3123ef1ab6"`);
        await queryRunner.query(`ALTER TABLE "game_result" DROP CONSTRAINT "FK_942f4ae6957d9ae2495d278f626"`);
        await queryRunner.query(`ALTER TABLE "game_result" DROP CONSTRAINT "FK_52bde66db56be3188de670ff5c3"`);
        await queryRunner.query(`ALTER TABLE "game_data" DROP CONSTRAINT "FK_8854ee113e5b5d9c43ff9ee1c8b"`);
        await queryRunner.query(`ALTER TABLE "task_list" DROP CONSTRAINT "FK_327c552af9c4c1848240c88a984"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8bf6d736c49d48d91691ea0dfe5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d3d2362ee72d80b5bc0ff86d7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b188d190c3c80ea714346049e3"`);
        await queryRunner.query(`DROP TABLE "user_calls_call"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bcb8e9773d79c9874a61f79c3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fb6a986133f8f6cafb3d4fb31"`);
        await queryRunner.query(`DROP TABLE "user_tasks_task"`);
        await queryRunner.query(`DROP TABLE "call"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_chatrooms"`);
        await queryRunner.query(`DROP TABLE "chatroom"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "user_workspaces"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "game_result"`);
        await queryRunner.query(`DROP TABLE "game_data"`);
        await queryRunner.query(`DROP TABLE "task_list"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
