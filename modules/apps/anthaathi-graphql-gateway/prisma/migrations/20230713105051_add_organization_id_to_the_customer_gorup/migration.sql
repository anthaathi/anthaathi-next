/*
  Warnings:

  - Added the required column `organizationId` to the `customer_groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "crm"."customer_groups" ADD COLUMN     "organizationId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "crm"."customer_groups" ADD CONSTRAINT "customer_groups_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
