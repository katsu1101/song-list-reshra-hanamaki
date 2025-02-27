/*
  Warnings:

  - A unique constraint covering the columns `[videoId,timestamp]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Song_videoId_timestamp_key" ON "Song"("videoId", "timestamp");
