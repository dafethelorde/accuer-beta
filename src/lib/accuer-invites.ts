import type { InviteConfiguration } from "@/config";

export type InviteResult =
  | { readonly ok: true; readonly redeemedHash: string }
  | {
      readonly ok: false;
      readonly reason: "invalid" | "already-redeemed" | "unavailable";
    };

export async function hashInviteCode(code: string): Promise<string | null> {
  if (!globalThis.crypto?.subtle) return null;

  try {
    const normalized = code.trim().toUpperCase();
    const bytes = new TextEncoder().encode(normalized);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
}

export async function verifyInviteCode(
  code: string,
  invite: InviteConfiguration,
): Promise<InviteResult> {
  const submittedHash = await hashInviteCode(code);
  if (!submittedHash) return { ok: false, reason: "unavailable" };

  const validHashes = invite.sha256Hashes.filter((value) => /^[a-f\d]{64}$/i.test(value));
  if (validHashes.length === 0) return { ok: false, reason: "unavailable" };

  const matches = validHashes.some((hash) => {
    let difference = 0;
    for (let index = 0; index < submittedHash.length; index += 1) {
      difference |= submittedHash.charCodeAt(index) ^ hash.toLowerCase().charCodeAt(index);
    }
    return difference === 0;
  });
  if (!matches) return { ok: false, reason: "invalid" };

  try {
    if (sessionStorage.getItem(`${invite.redeemedPrefix}${submittedHash}`) === "1") {
      return { ok: false, reason: "already-redeemed" };
    }
    sessionStorage.setItem(`${invite.redeemedPrefix}${submittedHash}`, "1");
    sessionStorage.setItem(invite.sessionKey, "granted");
    return { ok: true, redeemedHash: submittedHash };
  } catch {
    // In-memory access is still available when browser session storage is disabled.
    return { ok: true, redeemedHash: submittedHash };
  }
}

export function restoreBetaAccess(sessionKey: string): boolean {
  try {
    return sessionStorage.getItem(sessionKey) === "granted";
  } catch {
    return false;
  }
}