/*
  Warnings:

  - The `timestamp` column on the `Song` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Song_videoId_timestamp_key" ON "Song"("videoId", "timestamp");
