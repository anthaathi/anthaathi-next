-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "esg";

-- CreateTable
CREATE TABLE "esg"."order" (
    "id" SERIAL NOT NULL,
    "organizationId" UUID NOT NULL,
    "currency_code" VARCHAR(10) NOT NULL,
    "discount" MONEY NOT NULL,
    "shipping" MONEY NOT NULL,
    "subtotal" MONEY NOT NULL,
    "subtotal_incl_tax" MONEY NOT NULL,
    "tax" MONEY NOT NULL,
    "total_qty" INTEGER NOT NULL,
    "shipping_incl_tax" MONEY NOT NULL,
    "shipping_discount_amount" MONEY NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "esg"."order" ADD CONSTRAINT "order_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"."organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
