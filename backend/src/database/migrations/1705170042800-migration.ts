import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705170042800 implements MigrationInterface {
  name = 'Migration1705170042800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."role_name_enum" AS ENUM('Admin', 'Editor', 'User')
        `);
    await queryRunner.query(`
            CREATE TABLE "role" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" "public"."role_name_enum" NOT NULL,
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "travel" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "is_public" boolean NOT NULL,
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying NOT NULL,
                "number_of_days" integer NOT NULL,
                CONSTRAINT "UQ_05f9b8cc27aaff6e2cd51382a7f" UNIQUE ("name"),
                CONSTRAINT "PK_657b63ec7adcf2ecf757a490a67" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "tour" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "starting_date" TIME WITH TIME ZONE NOT NULL,
                "ending_date" TIME WITH TIME ZONE NOT NULL,
                "price" integer NOT NULL,
                "travel_id" uuid,
                CONSTRAINT "UQ_948c1044932dba70d131655953d" UNIQUE ("name"),
                CONSTRAINT "PK_972cd7fa4ec39286068130fa3f7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD CONSTRAINT "FK_afa7209ddd1fadc432eb410610b" FOREIGN KEY ("travel_id") REFERENCES "travel"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP CONSTRAINT "FK_afa7209ddd1fadc432eb410610b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"
        `);
    await queryRunner.query(`
            DROP TABLE "users_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "tour"
        `);
    await queryRunner.query(`
            DROP TABLE "travel"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "role"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."role_name_enum"
        `);
  }
}
