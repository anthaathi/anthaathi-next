-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "common";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crm";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "file";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "organization";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "project";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "task";

-- CreateEnum
CREATE TYPE "project"."ProjectType" AS ENUM ('Task');

-- CreateTable
CREATE TABLE "file"."file" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "byte_size" INTEGER NOT NULL,
    "metadata" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common"."address" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" VARCHAR(20),
    "zip_code" VARCHAR(255),
    "technical_contact" TEXT,
    "customer_id" INTEGER,
    "organization_id" UUID,
    "customer_organization_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."organization_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "config" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."organization" (
    "id" UUID NOT NULL,
    "name" VARCHAR(1000) NOT NULL,
    "description" TEXT,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "template_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."recent_organization" (
    "id" SERIAL NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recent_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."group_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "config" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "data" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."group_membership" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "user" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."customer_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "config" JSON NOT NULL,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."customer_organization_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "config" JSON NOT NULL,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_organization_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."customer_organization" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "data" JSONB NOT NULL,
    "customer_organization_template_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."customer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(1024) NOT NULL,
    "first_name" VARCHAR(512),
    "last_name" VARCHAR(512),
    "email" TEXT,
    "data" JSONB NOT NULL,
    "phone_number" VARCHAR(255),
    "company" VARCHAR(1024),
    "user_id" UUID,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."project_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "config" JSON NOT NULL,
    "data" JSON NOT NULL,
    "type" "project"."ProjectType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project"."project" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "data" JSON NOT NULL,
    "type" "project"."ProjectType" NOT NULL,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon_id" INTEGER,
    "config" JSON NOT NULL DEFAULT '{}',
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(255) NOT NULL,
    "organization_id" UUID NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(1024) NOT NULL,
    "description" TEXT,
    "data" JSONB NOT NULL,
    "author" UUID NOT NULL,
    "priority" VARCHAR(255),
    "due_date" TIMESTAMP(3),
    "emoji" VARCHAR(100),
    "project_id" INTEGER,
    "status_id" INTEGER,
    "organization_id" UUID NOT NULL,
    "task_template_id" INTEGER NOT NULL,
    "parent_task_id" INTEGER,
    "customer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_reffered_by" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_reffered_by_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_comment" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user" UUID,
    "content" TEXT NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_upvotes" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_upvotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_dependency" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_dependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_label" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(255) NOT NULL,
    "project_id" INTEGER NOT NULL,
    "organization_id" UUID NOT NULL,
    "task_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_assigned_user" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_assigned_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."task_assigned_group" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_assigned_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_key_key" ON "organization"."organization"("key");

-- CreateIndex
CREATE INDEX "organization_key_idx" ON "organization"."organization"("key");

-- AddForeignKey
ALTER TABLE "common"."address" ADD CONSTRAINT "address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "crm"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common"."address" ADD CONSTRAINT "address_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common"."address" ADD CONSTRAINT "address_customer_organization_id_fkey" FOREIGN KEY ("customer_organization_id") REFERENCES "crm"."customer_organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."organization" ADD CONSTRAINT "organization_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "organization"."organization_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."recent_organization" ADD CONSTRAINT "recent_organization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."group_membership" ADD CONSTRAINT "group_membership_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "organization"."group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer_template" ADD CONSTRAINT "customer_template_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer_organization_template" ADD CONSTRAINT "customer_organization_template_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer_organization" ADD CONSTRAINT "customer_organization_customer_organization_template_id_fkey" FOREIGN KEY ("customer_organization_template_id") REFERENCES "crm"."customer_organization_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."customer" ADD CONSTRAINT "customer_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project"."project" ADD CONSTRAINT "project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_template" ADD CONSTRAINT "task_template_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "file"."file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_template" ADD CONSTRAINT "task_template_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_status" ADD CONSTRAINT "task_status_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_status" ADD CONSTRAINT "task_status_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"."project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "task"."task_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_task_template_id_fkey" FOREIGN KEY ("task_template_id") REFERENCES "task"."task_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "task"."task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task" ADD CONSTRAINT "task_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "crm"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_reffered_by" ADD CONSTRAINT "task_reffered_by_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_reffered_by" ADD CONSTRAINT "task_reffered_by_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "crm"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_comment" ADD CONSTRAINT "task_comment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_upvotes" ADD CONSTRAINT "task_upvotes_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_dependency" ADD CONSTRAINT "task_dependency_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_label" ADD CONSTRAINT "task_label_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_label" ADD CONSTRAINT "task_label_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_label" ADD CONSTRAINT "task_label_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_assigned_user" ADD CONSTRAINT "task_assigned_user_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_assigned_group" ADD CONSTRAINT "task_assigned_group_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"."task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."task_assigned_group" ADD CONSTRAINT "task_assigned_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "organization"."group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
