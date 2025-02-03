/*
  Warnings:

  - A unique constraint covering the columns `[eventId,chip]` on the table `Competitor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Competitor_eventId_chip_key" ON "Competitor"("eventId", "chip");
