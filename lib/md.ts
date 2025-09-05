export function removeTitleFromMd(rawMd: string): string {
  return rawMd.trim().replace(/^\#\s+.+/, '')
}
