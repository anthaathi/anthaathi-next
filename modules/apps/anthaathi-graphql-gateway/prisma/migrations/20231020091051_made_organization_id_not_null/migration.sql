-- DropForeignKey
ALTER TABLE "task"."task_template" DROP CONSTRAINT "task_template_organization_id_fkey";

-- AlterTable
ALTER TABLE "task"."task_template" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "task"."task_template" ADD CONSTRAINT "task_template_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
