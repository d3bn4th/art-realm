-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentStatus" TEXT;
