import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIps1786580000000 implements MigrationInterface {
  name = 'AddUserIps1786580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "registration_ip" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "last_login_ip" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login_ip"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "registration_ip"`);
  }
}