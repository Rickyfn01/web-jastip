-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'CHECKING', 'READY_TO_PAY', 'PAID_DP', 'PURCHASED', 'SHIPPED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "size" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "storePrice" DOUBLE PRECISION,
    "finalPrice" DOUBLE PRECISION,
    "dpPercentage" INTEGER NOT NULL,
    "dpAmount" DOUBLE PRECISION,
    "receiptImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
