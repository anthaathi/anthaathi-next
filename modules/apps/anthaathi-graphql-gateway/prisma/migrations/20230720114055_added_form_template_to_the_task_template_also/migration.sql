-- AlterTable
ALTER TABLE "task"."task_template" ADD COLUMN     "feedback_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taskFeedbackFormId" INTEGER;

-- AddForeignKey
ALTER TABLE "task"."task_template" ADD CONSTRAINT "task_template_taskFeedbackFormId_fkey" FOREIGN KEY ("taskFeedbackFormId") REFERENCES "task"."task_feedback_form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
