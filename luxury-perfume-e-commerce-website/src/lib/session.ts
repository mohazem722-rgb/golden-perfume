import crypto from "crypto";
import { cookies } from "next/headers";

const secret = process.env.SESSION_SECRET || "maison-noir-session-secret";

export function sign(value: string): string {
  const sig = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${sig}`;
}

export function verify(signed: string | undefined | null): string | null {
  if (!signed) return null;
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  if (timingSafeStrEq(sig, expected)) return value;
  return null;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verify(store.get("mn_admin")?.value) === "admin";
}

export async function getCustomerId(): Promise<number | null> {
  const store = await cookies();
  const v = verify(store.get("mn_cust")?.value);
  if (!v) return null;
  const id = parseInt(v, 10);
  return Number.isFinite(id) ? id : null;
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, s, 64).toString("hex");
  return { hash, salt: s };
}

export function timingSafeStrEq(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
  return diff === 0;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [s, h] = stored.split("$");
  if (!s || !h) return false;
  const { hash } = hashPassword(password, s);
  return timingSafeStrEq(hash, h);
}

export function storedPasswordHash(password: string): string {
  const { hash, salt } = hashPassword(password);
  return `${salt}$${hash}`;
}
