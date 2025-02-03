/*
  Warnings:

  - Made the column `name` on table `AgeCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Competitor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surname` on table `Competitor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chip` on table `Competitor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ageCategoryId` on table `Competitor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Competitor" DROP CONSTRAINT "Competitor_ageCategoryId_fkey";

-- AlterTable
ALTER TABLE "AgeCategory" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Competitor" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "surname" SET NOT NULL,
ALTER COLUMN "chip" SET NOT NULL,
ALTER COLUMN "ageCategoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_ageCategoryId_fkey" FOREIGN KEY ("ageCategoryId") REFERENCES "AgeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
