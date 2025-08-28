/**
 * Got from https://github.com/millerized/smart-truncate truncate a given
 * string.
 *
 * @param {string} string - A string with a minimum length of 4 chars.
 * @param {number} length - The length of the truncated result.
 * @param {SmartTruncateOptions} [options] - Options for truncation
 * @returns {string} - Return a truncated string w/ ellipsis or a custom mark.
 *
 *   Example: smartTruncate('Steve Miller', 8) === 'Steve M…'. Example:
 *   smartTruncate('Steve Miller', 9, {position: 4}) === 'Stev…ller'.
 */

// Интерфейс для опций функции
interface SmartTruncateOptions {
  /** The character[s] indicating omission. Default is '…' */
  mark?: string
  /** The index of the ellipsis (zero based). Default is the end */
  position?: number
}

export const smartTruncate = (
  string: string,
  length: number,
  {
    mark = '\u2026', // ellipsis = …
    position = length - 1,
  }: SmartTruncateOptions = {}
): string => {
  if (typeof mark !== 'string') return string

  const markOffset = mark.length
  const minLength = 4

  let str = string

  if (typeof str === 'string') {
    str = str.trim()
  }

  const invalid =
    typeof str !== 'string' ||
    str.length < minLength ||
    typeof length !== 'number' ||
    length <= minLength ||
    length >= str.length - markOffset

  if (invalid) return string

  if (position >= length - markOffset) {
    const start = str.substring(0, length - markOffset)
    return `${start}${mark}`
  }

  const start = str.substring(0, position)
  const end = str.slice(position + markOffset - length)

  return `${start}${mark}${end}`
}
