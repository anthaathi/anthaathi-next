/*
  Warnings:

  - Added the required column `updated_at` to the `customer_group_association` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `customer_groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "crm"."customer_group_association" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "crm"."customer_groups" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
