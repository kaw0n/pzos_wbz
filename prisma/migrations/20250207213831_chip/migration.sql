/*
  Warnings:

  - You are about to drop the column `ifSportIdent` on the `Event` table. All the data in the column will be lost.
  - Made the column `chip` on table `Competitor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Competitor" ALTER COLUMN "chip" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "ifSportIdent";
