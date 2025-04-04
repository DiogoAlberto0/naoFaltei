-- CreateTable
CREATE TABLE "clockin" (
    "id" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_medical_certificate" BOOLEAN NOT NULL DEFAULT false,
    "is_tardiness" BOOLEAN NOT NULL DEFAULT false,
    "is_entry" BOOLEAN NOT NULL DEFAULT false,
    "lat" TEXT NOT NULL,
    "lng" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "registered_by" TEXT NOT NULL,

    CONSTRAINT "clockin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clockin" ADD CONSTRAINT "clockin_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
