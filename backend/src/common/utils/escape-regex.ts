/**
 * Escapes RegExp metacharacters so user input is matched as a literal substring.
 */
export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
