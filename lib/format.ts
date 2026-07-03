// Input formatting + validation helpers for Pakistani phone numbers and CNICs.
// Used across the public forms to restrict what users can type and to validate
// on submit.

/** Keep only digits, capped to `max` characters. */
export function digitsOnly(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max)
}

// ─── Phone (Pakistani mobile: 11 digits, e.g. 03001234567) ────────────────────

/** Restrict a phone input to at most 11 digits as the user types. */
export function formatPhone(value: string): string {
  return digitsOnly(value, 11)
}

/** Valid when exactly 11 digits and starting with 0 (03xxxxxxxxx). */
export function isValidPhone(value: string): boolean {
  return /^0\d{10}$/.test(value.replace(/\D/g, ""))
}

export const PHONE_HINT = "Phone number must be exactly 11 digits (e.g. 03001234567)."

// ─── CNIC (13 digits, shown as XXXXX-XXXXXXX-X) ───────────────────────────────

/** Restrict + auto-format a CNIC input as XXXXX-XXXXXXX-X while typing. */
export function formatCnic(value: string): string {
  const d = digitsOnly(value, 13)
  const parts = [d.slice(0, 5), d.slice(5, 12), d.slice(12, 13)].filter(Boolean)
  return parts.join("-")
}

/** Valid when it contains exactly 13 digits. */
export function isValidCnic(value: string): boolean {
  return value.replace(/\D/g, "").length === 13
}

export const CNIC_HINT = "CNIC / B-Form must be 13 digits (e.g. 35201-1234567-1)."
