import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionStatus1738097157047 implements MigrationInterface {
    name = 'SessionStatus1738097157047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."session_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "session" ADD "status" "public"."session_status_enum" NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."session_status_enum"`);
    }

}
