-- CreateEnum
CREATE TYPE "crm"."CustomerGroupType" AS ENUM ('Static', 'Dynamic');

-- AlterTable
ALTER TABLE "crm"."customer" ADD COLUMN     "customer_template_id" INTEGER;

-- CreateTable
CREATE TABLE "crm"."customer_groups" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "crm"."CustomerGroupType" NOT NULL,
    "condition" JSONB,

    CONSTRAINT "customer_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."customer_group_association" (
    "id" SERIAL NOT NULL,
    "customerGroupId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "customer_group_association_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "crm"."customer_group_association" ADD CONSTRAINT "customer_group_association_customerGroupId_fkey" FOREIGN KEY ("customerGroupId") REFERENCES "crm"."customer_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer_group_association" ADD CONSTRAINT "customer_group_association_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "crm"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer" ADD CONSTRAINT "customer_customer_template_id_fkey" FOREIGN KEY ("customer_template_id") REFERENCES "crm"."customer_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
