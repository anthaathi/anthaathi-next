/*
  Warnings:

  - A unique constraint covering the columns `[task_id,user]` on the table `task_assigned_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "task_assigned_user_task_id_user_key" ON "task"."task_assigned_user"("task_id", "user");
