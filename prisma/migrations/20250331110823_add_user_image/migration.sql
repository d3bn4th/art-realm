-- DropIndex
DROP INDEX "Artwork_artistId_idx";

-- DropIndex
DROP INDEX "Order_artworkId_idx";

-- DropIndex
DROP INDEX "Order_buyerId_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;
