/*
  Warnings:

  - You are about to drop the column `workerId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_workerId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "workerId";

-- CreateTable
CREATE TABLE "WorkerService" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "WorkerService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerService_workerId_serviceId_key" ON "WorkerService"("workerId", "serviceId");

-- AddForeignKey
ALTER TABLE "WorkerService" ADD CONSTRAINT "WorkerService_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerService" ADD CONSTRAINT "WorkerService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
