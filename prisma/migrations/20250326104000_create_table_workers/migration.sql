/*
  Warnings:

  - You are about to drop the `manager_on_establishments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `worker_on_establishments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "manager_on_establishments" DROP CONSTRAINT "manager_on_establishments_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "manager_on_establishments" DROP CONSTRAINT "manager_on_establishments_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_on_establishments" DROP CONSTRAINT "worker_on_establishments_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "worker_on_establishments" DROP CONSTRAINT "worker_on_establishments_worker_id_fkey";

-- DropTable
DROP TABLE "manager_on_establishments";

-- DropTable
DROP TABLE "worker_on_establishments";

-- CreateTable
CREATE TABLE "workers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workers_login_key" ON "workers"("login");

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
