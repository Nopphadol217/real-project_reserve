/*
  Warnings:

  - Added the required column `updatedAt` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `favorite` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
