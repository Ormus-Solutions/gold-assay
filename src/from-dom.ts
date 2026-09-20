/** Keep only what Jev should judge — drop chrome noise. */
export function compressDomText(raw: string, maxChars = 4000): string {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^(cookie|accept all|sign in with google)$/i.test(l));
  const joined = lines.join("\n");
  return joined.length <= maxChars ? joined : joined.slice(0, maxChars);
}
