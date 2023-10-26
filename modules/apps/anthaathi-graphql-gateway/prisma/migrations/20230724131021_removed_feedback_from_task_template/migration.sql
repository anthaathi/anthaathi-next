/*
  Warnings:

  - You are about to drop the column `taskFeedbackFormId` on the `task_template` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "task"."task_template" DROP CONSTRAINT "task_template_taskFeedbackFormId_fkey";

-- AlterTable
ALTER TABLE "task"."task_template" DROP COLUMN "taskFeedbackFormId",
ADD COLUMN     "task_feedback_form_id" INTEGER;

-- AddForeignKey
ALTER TABLE "task"."task_template" ADD CONSTRAINT "task_template_task_feedback_form_id_fkey" FOREIGN KEY ("task_feedback_form_id") REFERENCES "task"."task_feedback_form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
