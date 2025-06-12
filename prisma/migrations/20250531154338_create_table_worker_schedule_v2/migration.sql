-- CreateTable
CREATE TABLE "worker_schedule_v2" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'day',
    "month_minutes" INTEGER,
    "week_minutes" INTEGER,
    "sunday_minutes" INTEGER,
    "monday_minutes" INTEGER,
    "tuesday_minutes" INTEGER,
    "wednesday_minutes" INTEGER,
    "thursday_minutes" INTEGER,
    "friday_minutes" INTEGER,
    "saturday_minutes" INTEGER,
    "daysOff" TEXT[],
    "worker_id" TEXT NOT NULL,

    CONSTRAINT "worker_schedule_v2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_schedule_v2_worker_id_key" ON "worker_schedule_v2"("worker_id");

-- AddForeignKey
ALTER TABLE "worker_schedule_v2" ADD CONSTRAINT "worker_schedule_v2_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
