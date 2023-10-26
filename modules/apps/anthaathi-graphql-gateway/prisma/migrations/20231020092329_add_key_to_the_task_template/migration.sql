/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `task_template` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "task"."task_template" ADD COLUMN     "key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "task_template_key_key" ON "task"."task_template"("key");
