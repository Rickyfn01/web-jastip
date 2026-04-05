import crypto from 'crypto';

const SESSION_SECRET = process.env.CUSTOMER_SESSION_SECRET || 'customer-session-secret';

export function normalizeWhatsAppNumber(input: string) {
  return input.trim().replace(/[\s-]/g, '');
}

export function hashCustomerPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyCustomerPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = crypto.scryptSync(password, salt, 64);
  const expectedKey = Buffer.from(hash, 'hex');

  if (derivedKey.length !== expectedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, expectedKey);
}

export function createCustomerSessionToken(customerId: string) {
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(customerId).digest('hex');
  return `${customerId}.${signature}`;
}

export function verifyCustomerSessionToken(token: string): string | null {
  const [customerId, signature] = token.split('.');
  
  if (!customerId || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(customerId).digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  return customerId;
}
