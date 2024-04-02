/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendees_public_id_key" ON "attendees"("public_id");
