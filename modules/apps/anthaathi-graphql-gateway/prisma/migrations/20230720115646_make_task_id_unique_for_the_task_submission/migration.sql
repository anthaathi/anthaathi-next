/*
  Warnings:

  - A unique constraint covering the columns `[task_id]` on the table `task_feedback_submission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "task_feedback_submission_task_id_key" ON "task"."task_feedback_submission"("task_id");
