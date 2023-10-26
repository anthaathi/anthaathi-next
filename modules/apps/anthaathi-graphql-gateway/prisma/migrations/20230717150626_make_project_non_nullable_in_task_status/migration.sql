-- DropForeignKey
ALTER TABLE "task"."task_status" DROP CONSTRAINT "task_status_project_id_fkey";

-- AlterTable
ALTER TABLE "task"."task_status" ALTER COLUMN "project_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "task"."task_status" ADD CONSTRAINT "task_status_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"."project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
