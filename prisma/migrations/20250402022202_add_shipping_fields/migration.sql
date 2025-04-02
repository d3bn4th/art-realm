-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "expectedDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingDate" TIMESTAMP(3),
ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "trackingNumber" TEXT;
