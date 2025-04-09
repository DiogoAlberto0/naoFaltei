/*
  Warnings:

  - You are about to drop the column `date_time` on the `clockin` table. All the data in the column will be lost.
  - You are about to drop the column `is_medical_certificate` on the `clockin` table. All the data in the column will be lost.
  - You are about to drop the column `is_tardiness` on the `clockin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clockin" DROP COLUMN "date_time",
DROP COLUMN "is_medical_certificate",
DROP COLUMN "is_tardiness",
ADD COLUMN     "clocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "work_day_summary" (
    "id" TEXT NOT NULL,
    "work_date" DATE NOT NULL,
    "expected_minutes" INTEGER NOT NULL DEFAULT 0,
    "worked_minutes" INTEGER NOT NULL DEFAULT 0,
    "rested_minutes" INTEGER NOT NULL DEFAULT 0,
    "time_balance" INTEGER NOT NULL DEFAULT 0,
    "is_medical_leave" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'present',
    "worker_id" TEXT NOT NULL,

    CONSTRAINT "work_day_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_day_summary_worker_id_work_date_key" ON "work_day_summary"("worker_id", "work_date");

-- AddForeignKey
ALTER TABLE "work_day_summary" ADD CONSTRAINT "work_day_summary_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
