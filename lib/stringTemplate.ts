import { deepGet, isPathValid } from './deepManipulate.js'

/**
 * Безопасно выполняет выражение в контексте данных Поддерживает только
 * безопасные операции: арифметические, логические, сравнение Запрещает доступ к
 * глобальным объектам и выполнение функций
 *
 * @param {string} expression - Выражение для выполнения
 * @param {Record<string, any>} data - Данные для контекста
 * @returns {any} - Результат выполнения выражения
 */
function safeEval(expression: string, data: Record<string, any>): any {
  try {
    // Удаляем пробелы в начале и конце
    const trimmedExpr = expression.trim()

    // Проверяем, что выражение не пустое
    if (!trimmedExpr) {
      return ''
    }

    // Создаем безопасный контекст с данными
    const context = { ...data }

    // Создаем функцию, которая будет выполнять выражение
    // Используем Function constructor для изоляции от глобального контекста
    // Передаем все переменные как параметры функции
    const paramNames = Object.keys(context)
    const paramValues = Object.values(context)

    const func = new Function(...paramNames, `return (${trimmedExpr});`)

    // Выполняем функцию с параметрами
    const result = func(...paramValues)

    // Безопасное преобразование результата
    if (result === null || result === undefined) {
      return ''
    }

    return result
  } catch (error) {
    // В случае ошибки возвращаем пустую строку
    return ''
  }
}

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
 * @param {object} options - Опции обработки
 * @param {boolean} options.eval - Если true, то содержимое шаблона выполняется
 *   как выражение
 * @returns {string} - Обработанный шаблон
 */
export function standardTemplate(
  tmpl: string | null | undefined,
  data: Record<string, any> | null | undefined,
  options: { eval?: boolean } = { eval: false }
): string {
  // Проверяем входные параметры на null и undefined
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const templateRegex = /\$\{([^}]*)\}/g
  let match

  while ((match = templateRegex.exec(tmpl)) !== null) {
    const key = match[1] // содержимое внутри скобок, например "PROPS.t.links.recent"

    // Экранируем специальные символы для безопасного использования в регулярном выражении
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\$\\{${escapedKey}\\}`, 'g')

    let stringValue: string

    if (options.eval) {
      // Если включен eval, выполняем выражение безопасно
      if (!key.trim()) {
        // Если выражение пустое, возвращаем пустую строку
        stringValue = ''
      } else {
        const result = safeEval(key, data)
        stringValue =
          result === null || result === undefined ? '' : String(result)
      }
    } else {
      // Обычная обработка - проверяем путь и получаем значение
      if (!isPathValid(key)) {
        // Если путь некорректный, возвращаем исходный шаблон
        stringValue = match[0]
      } else {
        // Получаем значение по пути с точками
        const value = deepGet(data, key)
        // Безопасное преобразование значения в строку
        stringValue = value === null || value === undefined ? '' : String(value)
      }
    }

    // Заменяем все вхождения
    res = res.replace(replaceRegex, stringValue)
  }

  return res
}
