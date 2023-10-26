-- DropForeignKey
ALTER TABLE "task"."task" DROP CONSTRAINT "task_customer_id_fkey";

-- AlterTable
ALTER TABLE "task"."task" ALTER COLUMN "customer_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task"."task_template" ADD COLUMN     "description_template" TEXT,
ADD COLUMN     "title_template" TEXT;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "crm"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
