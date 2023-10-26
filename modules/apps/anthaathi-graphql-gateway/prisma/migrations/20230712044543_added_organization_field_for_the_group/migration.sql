/*
  Warnings:

  - Added the required column `organizationId` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization"."group" ADD COLUMN     "organizationId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "organization"."group" ADD CONSTRAINT "group_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
