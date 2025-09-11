import { deepGet, isPathValid } from './deepManipulate.js'

/**
 * Обрабатывает mustache шаблоны с синтаксисом {{value.child}}
 *
 * @param {string | null | undefined} tmpl - Шаблон для обработки
 * @param {object | null | undefined} data - Данные для подстановки
 * @returns {string} - Обработанный шаблон
 */
export function mustacheTemplate(
  tmpl: string | null | undefined,
  data: Record<string, any> | null | undefined
): string {
  // Проверяем входные параметры на null и undefined
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const mustacheRegex = /\{\{([^}]+)\}\}/g
  let match

  while ((match = mustacheRegex.exec(tmpl)) !== null) {
    const key = match[1].trim() // содержимое внутри скобок, например "PROPS.t.links.recent"

    // Экранируем специальные символы для безопасного использования в регулярном выражении
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g')

    // Проверяем, является ли путь корректным
    if (!isPathValid(key)) {
      // Если путь некорректный, возвращаем исходный шаблон
      const stringValue = match[0]
      res = res.replace(replaceRegex, stringValue)
      continue
    }

    // Получаем значение по пути с точками
    const value = deepGet(data, key)

    // Безопасное преобразование значения в строку
    const stringValue =
      value === null || value === undefined ? '' : String(value)

    // Заменяем все вхождения
    res = res.replace(replaceRegex, stringValue)
  }

  return res
}

/**
 * Обрабатывает стандартные шаблоны с синтаксисом ${value.child}
 *
 * @param {string | null | undefined} tmpl - Шаблон для обработки
 * @param {object | null | undefined} data - Данные для подстановки
 * @returns {string} - Обработанный шаблон
 */
export function standardTemplate(
  tmpl: string | null | undefined,
  data: Record<string, any> | null | undefined
): string {
  // Проверяем входные параметры на null и undefined
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const templateRegex = /\$\{([^}]+)\}/g
  let match

  while ((match = templateRegex.exec(tmpl)) !== null) {
    const key = match[1] // содержимое внутри скобок, например "PROPS.t.links.recent"

    // Экранируем специальные символы для безопасного использования в регулярном выражении
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\$\\{${escapedKey}\\}`, 'g')

    // Проверяем, является ли путь корректным
    if (!isPathValid(key)) {
      // Если путь некорректный, возвращаем исходный шаблон
      const stringValue = match[0]
      res = res.replace(replaceRegex, stringValue)
      continue
    }

    // Получаем значение по пути с точками
    const value = deepGet(data, key)

    // Безопасное преобразование значения в строку
    const stringValue =
      value === null || value === undefined ? '' : String(value)

    // Заменяем все вхождения
    res = res.replace(replaceRegex, stringValue)
  }

  return res
}
