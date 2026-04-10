ALTER TABLE "Order"
ADD COLUMN "xenditInvoiceId" TEXT,
ADD COLUMN "xenditInvoiceUrl" TEXT,
ADD COLUMN "xenditInvoiceStatus" TEXT,
ADD COLUMN "dpPaidAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Order_xenditInvoiceId_key" ON "Order"("xenditInvoiceId");
