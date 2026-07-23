/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'INDEPENDENT_WORKER';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_ownerId_key" ON "Organization"("ownerId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
