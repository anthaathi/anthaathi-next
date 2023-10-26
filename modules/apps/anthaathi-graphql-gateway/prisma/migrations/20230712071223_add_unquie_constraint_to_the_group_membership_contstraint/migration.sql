/*
  Warnings:

  - You are about to drop the column `groupTemplateId` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `group` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[group_id,user]` on the table `group_membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group_template_id` to the `group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "organization"."group" DROP CONSTRAINT "group_groupTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "organization"."group" DROP CONSTRAINT "group_organizationId_fkey";

-- AlterTable
ALTER TABLE "organization"."group" DROP COLUMN "groupTemplateId",
DROP COLUMN "organizationId",
ADD COLUMN     "group_template_id" INTEGER NOT NULL,
ADD COLUMN     "organization_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "group_membership_group_id_user_key" ON "organization"."group_membership"("group_id", "user");

-- AddForeignKey
ALTER TABLE "organization"."group" ADD CONSTRAINT "group_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."group" ADD CONSTRAINT "group_group_template_id_fkey" FOREIGN KEY ("group_template_id") REFERENCES "organization"."group_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
