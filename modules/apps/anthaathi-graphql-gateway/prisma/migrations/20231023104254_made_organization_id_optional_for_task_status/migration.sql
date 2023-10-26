-- DropForeignKey
ALTER TABLE "task"."task_status" DROP CONSTRAINT "task_status_organization_id_fkey";

-- AlterTable
ALTER TABLE "task"."task_status" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "task"."task_status" ADD CONSTRAINT "task_status_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
