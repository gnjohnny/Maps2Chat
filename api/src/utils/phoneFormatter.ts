/**
 * Transposes and formats a phone number string to Kenyan E.164 format (254XXXXXXXXX).
 * Discards any non-digit characters.
 * Matches local prefixes like 07... or 01... and transposes them to 2547... / 2541...
 */
export function formatKenyaPhoneNumber(phone: string): string | null {
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (!digits) return null;

  // Case 1: Starts with 07 or 01 (10 digits total)
  if (digits.length === 10 && (digits.startsWith('07') || digits.startsWith('01'))) {
    return '254' + digits.substring(1);
  }

  // Case 2: Starts with 254 (12 digits total)
  if (digits.length === 12 && digits.startsWith('254')) {
    return digits;
  }

  // Case 3: Starts with 7 or 1 (9 digits total, e.g. user entered phone without leading 0)
  if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
    return '254' + digits;
  }

  // Case 4: Starts with 020 (9 digits total, local landline)
  if (digits.length === 9 && digits.startsWith('020')) {
    return '254' + digits.substring(1);
  }

  return null;
}
