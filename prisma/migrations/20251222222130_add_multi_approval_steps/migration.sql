-- AlterTable
ALTER TABLE "public"."applications" ADD COLUMN     "current_step" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."template_approval_routes" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "step_order" INTEGER NOT NULL,
    "approver_user_id" INTEGER,
    "approver_role_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_approval_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."application_approval_steps" (
    "id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "step_order" INTEGER NOT NULL,
    "approver_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "acted_at" TIMESTAMP(6),
    "comment" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_approval_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_approval_routes_template_id_step_order_key" ON "public"."template_approval_routes"("template_id", "step_order");

-- CreateIndex
CREATE UNIQUE INDEX "application_approval_steps_application_id_step_order_key" ON "public"."application_approval_steps"("application_id", "step_order");

-- AddForeignKey
ALTER TABLE "public"."template_approval_routes" ADD CONSTRAINT "template_approval_routes_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."application_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."template_approval_routes" ADD CONSTRAINT "template_approval_routes_approver_user_id_fkey" FOREIGN KEY ("approver_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."template_approval_routes" ADD CONSTRAINT "template_approval_routes_approver_role_id_fkey" FOREIGN KEY ("approver_role_id") REFERENCES "public"."roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_approval_steps" ADD CONSTRAINT "application_approval_steps_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_approval_steps" ADD CONSTRAINT "application_approval_steps_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
