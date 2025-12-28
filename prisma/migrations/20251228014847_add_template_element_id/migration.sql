/*
  Warnings:

  - Added the required column `template_element_id` to the `application_values` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."application_values" ADD COLUMN     "template_element_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."application_values" ADD CONSTRAINT "application_values_template_element_id_fkey" FOREIGN KEY ("template_element_id") REFERENCES "public"."template_elements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
