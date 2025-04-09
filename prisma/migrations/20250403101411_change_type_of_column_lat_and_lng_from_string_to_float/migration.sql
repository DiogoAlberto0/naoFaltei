/*
  Warnings:

  - The `lat` column on the `establishments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lng` column on the `establishments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `lat` on the `clockin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lng` on the `clockin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "clockin" DROP COLUMN "lat",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
DROP COLUMN "lng",
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "lat",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
DROP COLUMN "lng",
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
