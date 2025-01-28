import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrackingId1738095460752 implements MigrationInterface {
  name = 'TrackingId1738095460752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "trackingId" character varying(12) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_f0255a9842626c3f596e2108a3a" UNIQUE ("trackingId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_f0255a9842626c3f596e2108a3a"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "trackingId"`);
  }
}
