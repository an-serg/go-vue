import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileFields1786579200000 implements MigrationInterface {
  name = 'AddProfileFields1786579200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "avatar_url" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "settings" jsonb NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" ADD "last_login" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "settings"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
  }
}