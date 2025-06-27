/*
  Warnings:

  - You are about to drop the column `publicId` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `place` table. All the data in the column will be lost.
  - Added the required column `public_id` to the `Gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Made the column `secure_url` on table `place` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `gallery` DROP COLUMN `publicId`,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `place` DROP COLUMN `publicId`,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    MODIFY `secure_url` VARCHAR(191) NOT NULL;
