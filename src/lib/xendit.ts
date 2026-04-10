import { Xendit } from 'xendit-node';
import type { CreateInvoiceRequest } from 'xendit-node/invoice/models';

export interface CreateDpInvoiceInput {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
}

export interface CreatedDpInvoice {
  id: string;
  invoiceUrl: string;
  status: string;
  expiryDate: Date;
}

function getXenditClient() {
  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('XENDIT_SECRET_KEY belum dikonfigurasi.');
  }

  return new Xendit({ secretKey });
}

export async function createDpInvoice(input: CreateDpInvoiceInput): Promise<CreatedDpInvoice> {
  const client = getXenditClient();
  const invoiceClient = client.Invoice;

  const externalId = `order-dp-${input.orderId}`;
  const data: CreateInvoiceRequest = {
    externalId,
    amount: input.amount,
    currency: 'IDR',
    description: `Pembayaran DP pesanan jastip #${input.orderId}`,
    payerEmail: input.customerEmail,
    customer: {
      givenNames: input.customerName,
      email: input.customerEmail,
    },
    invoiceDuration: 24 * 60 * 60,
  };

  const invoice = await invoiceClient.createInvoice({ data });

  if (!invoice.id || !invoice.invoiceUrl || !invoice.status || !invoice.expiryDate) {
    throw new Error('Respon pembuatan invoice Xendit tidak lengkap.');
  }

  return {
    id: invoice.id,
    invoiceUrl: invoice.invoiceUrl,
    status: invoice.status,
    expiryDate: invoice.expiryDate,
  };
}
