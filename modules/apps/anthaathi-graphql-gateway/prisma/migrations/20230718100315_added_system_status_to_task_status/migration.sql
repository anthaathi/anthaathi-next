-- CreateEnum
CREATE TYPE "task"."SystemStatus" AS ENUM ('Done', 'Pending', 'Blocked', 'InProgress', 'Rejected');

-- AlterTable
ALTER TABLE "task"."task_status" ADD COLUMN     "system_status" "task"."SystemStatus";
