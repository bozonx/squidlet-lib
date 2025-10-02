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
  /** Whether to respect word boundaries. Default is false */
  respectWords?: boolean
  removeReturns?: boolean
  /** Whether to place mark at the end. Default is true */
  markAtTheEnd?: boolean
}

const minLength = 4

export const smartTruncate = (
  rawString: string,
  length: number,
  {
    mark = '\u2026', // ellipsis = …
    position = length - 1,
    respectWords = false,
    removeReturns = true,
    markAtTheEnd = true,
  }: SmartTruncateOptions = {}
): string => {
  if (
    typeof mark !== 'string' ||
    typeof rawString !== 'string' ||
    length <= minLength
  )
    return rawString

  const markOffset = mark.length
  let str = rawString

  if (removeReturns) {
    str = str.replace(/\n/g, ' ')
  }

  // replace multiple spaces with one (but preserve newlines if removeReturns is false)
  if (removeReturns) {
    str = str.replace(/\s+/g, ' ').trim()
  } else {
    str = str.replace(/[ \t]+/g, ' ').trim()
  }

  if (str.length < minLength || length >= str.length) return str

  // Если markAtTheEnd отключен, просто обрезаем строку без маркера
  if (!markAtTheEnd) {
    return str.substring(0, length)
  }

  // Если включено уважение к границам слов, используем улучшенную логику
  if (respectWords) {
    return smartTruncateWithWordBoundaries(str, length, mark, markAtTheEnd)
  }

  // Если позиция больше или равна длине строки, обрезаем в конце
  if (position >= str.length) {
    const start = str.substring(0, length - markOffset)
    return `${start}${mark}`
  }

  // Если позиция больше или равна длине результата минус маркер, обрезаем в конце
  if (position >= length - markOffset) {
    const start = str.substring(0, length - markOffset)
    return `${start}${mark}`
  }

  const start = str.substring(0, position)
  const end = str.slice(position + markOffset - length)

  return `${start}${mark}${end}`
}

/**
 * Улучшенная версия функции smartTruncate, которая учитывает границы слов
 *
 * @param {string} str - Строка для обрезания
 * @param {number} length - Максимальная длина результата
 * @param {string} mark - Маркер обрезания
 * @param {boolean} markAtTheEnd - Размещать ли маркер в конце
 * @returns {string} - Обрезанная строка с учетом границ слов
 */
export const smartTruncateWithWordBoundaries = (
  str: string,
  length: number,
  mark: string = '\u2026',
  markAtTheEnd: boolean = true
): string => {
  // Если строка короче или равна целевой длине, возвращаем как есть
  if (str.length <= length) return str

  // Если markAtTheEnd отключен, просто обрезаем строку без маркера
  if (!markAtTheEnd) {
    return str.substring(0, length)
  }

  // Вычисляем максимальную длину текста без маркера
  const maxTextLength = length - mark.length

  // Если максимальная длина текста слишком мала, возвращаем только маркер
  if (maxTextLength <= 0) return mark

  // Обрезаем строку до максимальной длины
  const truncated = str.substring(0, maxTextLength)

  // Ищем последний пробел в обрезанной части
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  // Если найден пробел и он не в начале строки, обрезаем по границе слова
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + mark
  }

  // Если пробел не найден или он в начале, обрезаем по символам
  return truncated + mark
}

/**
 * Умное обрезание строки с учетом границ слов (основная функция)
 *
 * @example
 *   smartTruncateWords('Hello World', 7) // 'Hello…'
 *   smartTruncateWords('This is a test', 9) // 'This is…'
 *   smartTruncateWords('Programming is fun', 12) // 'Programming…'
 *
 * @param {string} str - Строка для обрезания
 * @param {number} length - Максимальная длина результата
 * @param {string} mark - Маркер обрезания (по умолчанию '…')
 * @param {boolean} markAtTheEnd - Размещать ли маркер в конце (по умолчанию
 *   true)
 * @returns {string} - Обрезанная строка с учетом границ слов
 */
export const smartTruncateWords = (
  str: string,
  length: number,
  mark: string = '\u2026',
  markAtTheEnd: boolean = true
): string => {
  return smartTruncateWithWordBoundaries(str, length, mark, markAtTheEnd)
}
