-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NULL,
    `Email` VARCHAR(255) NULL,
    `Password` VARCHAR(255) NULL,
    `IsActive` BOOLEAN NULL,
    `IsDeleted` BOOLEAN NULL,
    `createdAt` DATETIME(0) NULL,

    UNIQUE INDEX `users_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
