import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705249327111 implements MigrationInterface {
    name = 'Migration1705249327111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tours" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying NOT NULL,
                "starting_date" TIME WITH TIME ZONE NOT NULL,
                "ending_date" TIME WITH TIME ZONE NOT NULL,
                "price" integer NOT NULL,
                "travel_id" uuid,
                CONSTRAINT "UQ_103e1e02c612c0d0d31686bb251" UNIQUE ("name"),
                CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "travels" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "is_public" boolean NOT NULL,
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying NOT NULL,
                "number_of_days" integer NOT NULL,
                "mood" jsonb NOT NULL,
                CONSTRAINT "UQ_b24d3561bfa27a076dd9466cd28" UNIQUE ("name"),
                CONSTRAINT "PK_cc2d44f93ba8f6b268978971e2b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."roles_name_enum" AS ENUM('Admin', 'Editor', 'User')
        `);
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" "public"."roles_name_enum" NOT NULL,
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
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
            ALTER TABLE "tours"
            ADD CONSTRAINT "FK_b3977b16c820f3a64680038c54e" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
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
            ALTER TABLE "tours" DROP CONSTRAINT "FK_b3977b16c820f3a64680038c54e"
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
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."roles_name_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "travels"
        `);
        await queryRunner.query(`
            DROP TABLE "tours"
        `);
    }

}
