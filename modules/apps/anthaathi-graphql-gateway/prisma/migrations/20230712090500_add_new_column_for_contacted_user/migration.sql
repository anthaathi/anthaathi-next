/*
  Warnings:

  - Added the required column `contacted_user_id` to the `recently_contacted_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "common"."recently_contacted_user" ADD COLUMN     "contacted_user_id" UUID NOT NULL;
