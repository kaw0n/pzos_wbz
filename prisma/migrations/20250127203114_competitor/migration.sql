-- DropForeignKey
ALTER TABLE "Competitor" DROP CONSTRAINT "Competitor_enrollId_fkey";

-- CreateIndex
CREATE INDEX "Competitor_enrollId_idx" ON "Competitor"("enrollId");

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_enrollId_fkey" FOREIGN KEY ("enrollId") REFERENCES "Enroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
