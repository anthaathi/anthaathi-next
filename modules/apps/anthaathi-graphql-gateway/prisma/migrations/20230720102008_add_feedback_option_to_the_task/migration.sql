-- AlterTable
ALTER TABLE "task"."task" ADD COLUMN     "feedback_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "feedback_submitted_at" TIMESTAMP(3),
ADD COLUMN     "task_feedback_form_id" INTEGER,
ADD COLUMN     "task_feedback_submission_id" UUID;

-- CreateTable
CREATE TABLE "task"."task_feedback_form" (
    "id" SERIAL NOT NULL,
    "organization_id" UUID NOT NULL,
    "form" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_feedback_form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_feedback_submission" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "task_feedback_submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task"."task_feedback_form" ADD CONSTRAINT "task_feedback_form_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_feedback_submission" ADD CONSTRAINT "task_feedback_submission_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_task_feedback_form_id_fkey" FOREIGN KEY ("task_feedback_form_id") REFERENCES "task"."task_feedback_form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
