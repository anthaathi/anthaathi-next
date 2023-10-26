/*
  Warnings:

  - A unique constraint covering the columns `[user,contacted_user_id]` on the table `recently_contacted_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `recently_contacted_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "common"."recently_contacted_user" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "user_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "recently_contacted_user_user_contacted_user_id_key" ON "common"."recently_contacted_user"("user", "contacted_user_id");
