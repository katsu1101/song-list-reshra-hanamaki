/*
  Warnings:

  - Made the column `timestamp` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "timestamp" SET NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT 0;
