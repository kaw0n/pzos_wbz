-- DropForeignKey
ALTER TABLE "Competitor" DROP CONSTRAINT "Competitor_ageCategoryId_fkey";

-- AlterTable
ALTER TABLE "Competitor" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "chip" DROP NOT NULL,
ALTER COLUMN "ageCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_ageCategoryId_fkey" FOREIGN KEY ("ageCategoryId") REFERENCES "AgeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
