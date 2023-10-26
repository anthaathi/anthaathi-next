-- CreateTable
CREATE TABLE "task"."default_assigned" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "task_template_id" INTEGER NOT NULL,

    CONSTRAINT "default_assigned_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task"."default_assigned" ADD CONSTRAINT "default_assigned_task_template_id_fkey" FOREIGN KEY ("task_template_id") REFERENCES "task"."task_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
