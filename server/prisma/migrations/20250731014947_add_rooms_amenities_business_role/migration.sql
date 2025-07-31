-- DropForeignKey
ALTER TABLE `gallery` DROP FOREIGN KEY `Gallery_placeId_fkey`;

-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_placeId_fkey`;

-- DropIndex
DROP INDEX `Gallery_placeId_fkey` ON `gallery`;

-- DropIndex
DROP INDEX `Room_placeId_fkey` ON `room`;

-- AlterTable
ALTER TABLE `place` ADD COLUMN `amenities` TEXT NULL,
    ADD COLUMN `rooms` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'BUSINESS') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `Gallery` ADD CONSTRAINT `Gallery_placeId_fkey` FOREIGN KEY (`placeId`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_placeId_fkey` FOREIGN KEY (`placeId`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
