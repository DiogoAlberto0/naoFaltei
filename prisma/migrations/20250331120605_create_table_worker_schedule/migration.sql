-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "worker_schedule" (
    "id" TEXT NOT NULL,
    "week_day" "WeekDay" NOT NULL,
    "start_hour" INTEGER NOT NULL,
    "start_minute" INTEGER NOT NULL,
    "end_hour" INTEGER NOT NULL,
    "end_minute" INTEGER NOT NULL,
    "rest_time_in_minutes" INTEGER NOT NULL,
    "is_day_off" BOOLEAN NOT NULL DEFAULT false,
    "worker_id" TEXT NOT NULL,

    CONSTRAINT "worker_schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "worker_schedule" ADD CONSTRAINT "worker_schedule_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
