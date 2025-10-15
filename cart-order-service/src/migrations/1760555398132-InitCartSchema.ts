import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCartSchema1760555398132 implements MigrationInterface {
  name = "InitCartSchema1760555398132";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" character varying NOT NULL, "title" character varying, "price" numeric(10,2) NOT NULL, "qty" integer NOT NULL, "cartId" uuid, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "session_id" character varying, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);
  }
}
