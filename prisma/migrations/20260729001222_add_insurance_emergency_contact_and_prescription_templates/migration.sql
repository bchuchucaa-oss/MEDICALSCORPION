-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "emergencyContactName" TEXT;
ALTER TABLE "Patient" ADD COLUMN "emergencyContactPhone" TEXT;
ALTER TABLE "Patient" ADD COLUMN "insuranceType" TEXT;

-- CreateTable
CREATE TABLE "PrescriptionTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrescriptionTemplate_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrescriptionTemplateItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    CONSTRAINT "PrescriptionTemplateItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PrescriptionTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
