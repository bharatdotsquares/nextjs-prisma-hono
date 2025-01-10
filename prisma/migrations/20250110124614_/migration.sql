-- CreateTable
CREATE TABLE `blogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Title` VARCHAR(255) NULL,
    `BlogType` VARCHAR(255) NULL,
    `Description` VARCHAR(255) NULL,
    `IsActive` BOOLEAN NULL,
    `IsDeleted` BOOLEAN NULL,
    `Created` BOOLEAN NULL,
    `Updated` BOOLEAN NULL,
    `FileUploaded` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sequelizemeta` (
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
