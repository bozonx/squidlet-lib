import { deepGet } from './deepManipulate.js'

/**
 * Обрабатывает mustache шаблоны с синтаксисом {{value.child}}
 *
 * @param {string} tmpl - Шаблон для обработки
 * @param {object} data - Данные для подстановки
 * @returns {string} - Обработанный шаблон
 */
export function mustacheTemplate(
  tmpl: string,
  data: Record<string, any>
): string {
  let res = tmpl
  const mustacheRegex = /\{\{([^}]+)\}\}/g
  let match

  while ((match = mustacheRegex.exec(tmpl)) !== null) {
    const key = match[1].trim() // содержимое внутри скобок, например "PROPS.t.links.recent"

    // Экранируем специальные символы для безопасного использования в регулярном выражении
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g')

    // Получаем значение по пути с точками
    const value = deepGet(data, key)

    // Заменяем все вхождения
    res = res.replace(replaceRegex, String(value || ''))
  }

  return res
}

/**
 * Обрабатывает стандартные шаблоны с синтаксисом ${value.child}
 *
 * @param {string} tmpl - Шаблон для обработки
 * @param {object} data - Данные для подстановки
 * @returns {string} - Обработанный шаблон
 */
export function standardTemplate(
  tmpl: string,
  data: Record<string, any>
): string {
  let res = tmpl
  const templateRegex = /\$\{([^}]+)\}/g
  let match

  while ((match = templateRegex.exec(tmpl)) !== null) {
    const key = match[1] // содержимое внутри скобок, например "PROPS.t.links.recent"

    // Экранируем специальные символы для безопасного использования в регулярном выражении
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\$\\{${escapedKey}\\}`, 'g')

    // Получаем значение по пути с точками
    const value = deepGet(data, key)

    // Заменяем все вхождения
    res = res.replace(replaceRegex, String(value || ''))
  }

  return res
}
