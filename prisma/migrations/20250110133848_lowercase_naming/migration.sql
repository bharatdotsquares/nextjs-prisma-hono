/*
  Warnings:

  - You are about to drop the column `Email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `IsActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `IsDeleted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `users_Email_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `Email`,
    DROP COLUMN `IsActive`,
    DROP COLUMN `IsDeleted`,
    DROP COLUMN `Name`,
    DROP COLUMN `Password`,
    ADD COLUMN `email` VARCHAR(255) NULL,
    ADD COLUMN `isActive` BOOLEAN NULL,
    ADD COLUMN `isDeleted` BOOLEAN NULL,
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `password` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
