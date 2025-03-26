/*
  Warnings:

  - You are about to drop the column `isManager` on the `workers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workers" DROP COLUMN "isManager",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_manager" BOOLEAN NOT NULL DEFAULT false;
