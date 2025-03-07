/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cpf" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "worker_on_establishments" (
    "worker_id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,

    CONSTRAINT "worker_on_establishments_pkey" PRIMARY KEY ("worker_id","establishment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "worker_on_establishments" ADD CONSTRAINT "worker_on_establishments_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_on_establishments" ADD CONSTRAINT "worker_on_establishments_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
