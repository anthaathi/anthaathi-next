-- CreateTable
CREATE TABLE "common"."recently_contacted_user" (
    "id" SERIAL NOT NULL,
    "user" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recently_contacted_user_pkey" PRIMARY KEY ("id")
);
