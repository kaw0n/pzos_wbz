/*
  Warnings:

  - Made the column `enrollId` on table `Competitor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Competitor" ALTER COLUMN "enrollId" SET NOT NULL;
