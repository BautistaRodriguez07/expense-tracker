/*
  Warnings:

  - The values [admin,user] on the enum `space_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "space_role_new" AS ENUM ('owner', 'member');
ALTER TABLE "public"."space_member" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "space_member" ALTER COLUMN "role" TYPE "space_role_new" USING ("role"::text::"space_role_new");
ALTER TYPE "space_role" RENAME TO "space_role_old";
ALTER TYPE "space_role_new" RENAME TO "space_role";
DROP TYPE "public"."space_role_old";
ALTER TABLE "space_member" ALTER COLUMN "role" SET DEFAULT 'member';
COMMIT;

-- AlterTable
ALTER TABLE "space_member" ALTER COLUMN "role" SET DEFAULT 'member';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_system_admin" BOOLEAN NOT NULL DEFAULT false;
