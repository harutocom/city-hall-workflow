/*
  Warnings:

  - You are about to drop the `approval_flows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."approval_flows" DROP CONSTRAINT "approval_flows_application_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."approval_flows" DROP CONSTRAINT "approval_flows_approver_id_fkey";

-- DropTable
DROP TABLE "public"."approval_flows";

-- CreateTable
CREATE TABLE "public"."approval_logs" (
    "id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "approver_id" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "comment" TEXT,
    "acted_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."approval_logs" ADD CONSTRAINT "approval_logs_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."approval_logs" ADD CONSTRAINT "approval_logs_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
