/*
  Warnings:

  - The primary key for the `booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `paymentMethod` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalNight` on the `booking` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `paymentslip` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `roomId` on table `booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `paymentslip` DROP FOREIGN KEY `PaymentSlip_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `paymentslip` DROP FOREIGN KEY `PaymentSlip_verifiedBy_fkey`;

-- DropIndex
DROP INDEX `Booking_roomId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP PRIMARY KEY,
    DROP COLUMN `paymentMethod`,
    DROP COLUMN `paymentStatus`,
    DROP COLUMN `stripePaymentId`,
    DROP COLUMN `stripeSessionId`,
    DROP COLUMN `total`,
    DROP COLUMN `totalNight`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `totalPrice` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `roomId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `paymentslip`;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
