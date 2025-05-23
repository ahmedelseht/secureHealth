-- DropForeignKey
ALTER TABLE "EncryptedPrescriptionData" DROP CONSTRAINT "EncryptedPrescriptionData_prescriptionId_fkey";

-- AddForeignKey
ALTER TABLE "EncryptedPrescriptionData" ADD CONSTRAINT "EncryptedPrescriptionData_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
