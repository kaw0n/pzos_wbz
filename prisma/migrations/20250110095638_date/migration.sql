/*
  Warnings:

  - You are about to drop the column `eventDate` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventDate",
ADD COLUMN     "date" TIMESTAMP(3);
