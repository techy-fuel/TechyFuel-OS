import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

// Email account passwords are real mailbox credentials, so they're encrypted
// at rest (AES-256-GCM) rather than stored as plain text, even though the
// table itself already has no client-reachable RLS policies. EMAIL_ENCRYPTION_KEY
// is a Vercel env var -- any string works, it's stretched into a proper key below.
function getKey() {
  const secret = process.env.EMAIL_ENCRYPTION_KEY;
  if (!secret) throw new Error('EMAIL_ENCRYPTION_KEY is not configured');
  return scryptSync(secret, 'tf-email-accounts', 32);
}

export function encryptPassword(plain) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return {
    encrypted: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
  };
}

export function decryptPassword(encrypted, iv, tag) {
  const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64')), decipher.final()]);
  return decrypted.toString('utf8');
}
