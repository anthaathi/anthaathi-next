/*
  Warnings:

  - You are about to drop the column `user_name` on the `recently_contacted_user` table. All the data in the column will be lost.
  - You are about to drop the column `customerGroupId` on the `customer_group_association` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `customer_group_association` table. All the data in the column will be lost.
  - You are about to drop the `customer_groups` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customer_group_id` to the `customer_group_association` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `customer_group_association` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "crm"."customer_group_association" DROP CONSTRAINT "customer_group_association_customerGroupId_fkey";

-- DropForeignKey
ALTER TABLE "crm"."customer_group_association" DROP CONSTRAINT "customer_group_association_customerId_fkey";

-- DropForeignKey
ALTER TABLE "crm"."customer_groups" DROP CONSTRAINT "customer_groups_organizationId_fkey";

-- AlterTable
ALTER TABLE "common"."recently_contacted_user" DROP COLUMN "user_name",
ADD COLUMN     "search_query" TEXT;

-- AlterTable
ALTER TABLE "crm"."customer_group_association" DROP COLUMN "customerGroupId",
DROP COLUMN "customerId",
ADD COLUMN     "customer_group_id" INTEGER NOT NULL,
ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "crm"."customer_groups";

-- CreateTable
CREATE TABLE "crm"."customer_group" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "crm"."CustomerGroupType" NOT NULL,
    "condition" JSONB,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "crm"."customer_group" ADD CONSTRAINT "customer_group_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer_group_association" ADD CONSTRAINT "customer_group_association_customer_group_id_fkey" FOREIGN KEY ("customer_group_id") REFERENCES "crm"."customer_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer_group_association" ADD CONSTRAINT "customer_group_association_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "crm"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
