/*
  Warnings:

  - Added the required column `enrollId` to the `Competitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competitor" ADD COLUMN     "enrollId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Enroll" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enroll_eventId_idx" ON "Enroll"("eventId");

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_enrollId_fkey" FOREIGN KEY ("enrollId") REFERENCES "Enroll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enroll" ADD CONSTRAINT "Enroll_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
