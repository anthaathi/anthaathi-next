/*
  Warnings:

  - Added the required column `groupTemplateId` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization"."group" ADD COLUMN     "groupTemplateId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "organization"."group" ADD CONSTRAINT "group_groupTemplateId_fkey" FOREIGN KEY ("groupTemplateId") REFERENCES "organization"."group_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
