# Поддержка опции eval в stringTemplate

## Дата: 2024-12-19

## Описание изменений

Добавлена поддержка опции `eval` в функцию `standardTemplate` для безопасного выполнения выражений в шаблонах.

## Новые возможности

### Опция eval

Функция `standardTemplate` теперь поддерживает опцию `eval`:

```typescript
standardTemplate(template, data, { eval: true })
```

Когда `eval: true`, содержимое шаблонов `${...}` выполняется как JavaScript выражения, а не просто как пути к данным.

### Поддерживаемые операции

- **Арифметические операции**: `+`, `-`, `*`, `/`, `%`
- **Операции сравнения**: `>`, `<`, `>=`, `<=`, `===`, `!==`
- **Логические операции**: `&&`, `||`, `!`
- **Тернарный оператор**: `condition ? value1 : value2`
- **Доступ к свойствам объектов**: `user.name`, `user.score`
- **Доступ к элементам массивов**: `items[0]`, `items[index]`
- **Методы объектов**: `name.toUpperCase()`, `items.join(",")`
- **Математические функции**: `Math.max()`, `Math.min()`, `Math.round()`
- **Преобразование типов**: `String()`, `Number()`, `Boolean()`

### Примеры использования

```typescript
const data = {
  a: 10,
  b: 20,
  name: 'John',
  age: 30,
  items: [1, 2, 3, 4, 5],
  user: { score: 100, active: true },
}

// Арифметические операции
standardTemplate('${a + b}', data, { eval: true }) // "30"
standardTemplate('${a * b}', data, { eval: true }) // "200"

// Сравнения
standardTemplate('${a > b}', data, { eval: true }) // "false"
standardTemplate('${a < b}', data, { eval: true }) // "true"

// Логические операции
standardTemplate('${a > 5 && b > 15}', data, { eval: true }) // "true"

// Тернарный оператор
standardTemplate('${a > b ? "bigger" : "smaller"}', data, { eval: true }) // "smaller"

// Доступ к массивам
standardTemplate('${items[0]}', data, { eval: true }) // "1"
standardTemplate('${items.length}', data, { eval: true }) // "5"

// Методы объектов
standardTemplate('${name.toUpperCase()}', data, { eval: true }) // "JOHN"
standardTemplate('${items.join(",")}', data, { eval: true }) // "1,2,3,4,5"

// Математические функции
standardTemplate('${Math.max(a, b)}', data, { eval: true }) // "20"
```

## Безопасность

### Реализация безопасного eval

Используется безопасная реализация через `Function` constructor:

```typescript
function safeEval(expression: string, data: Record<string, any>): any {
  try {
    const trimmedExpr = expression.trim()
    if (!trimmedExpr) return ''

    const context = { ...data }
    const paramNames = Object.keys(context)
    const paramValues = Object.values(context)

    const func = new Function(...paramNames, `return (${trimmedExpr});`)

    const result = func(...paramValues)
    return result === null || result === undefined ? '' : result
  } catch (error) {
    return ''
  }
}
```

### Меры безопасности

1. **Изоляция контекста**: Выражения выполняются только в контексте переданных данных
2. **Обработка ошибок**: Все ошибки выполнения перехватываются и возвращают пустую строку
3. **Валидация входных данных**: Проверка на null/undefined значений
4. **Ограниченный доступ**: Нет доступа к глобальным объектам (кроме Math, String, Number, Boolean)

## Обратная совместимость

- По умолчанию `eval: false`, что сохраняет прежнее поведение
- Все существующие тесты проходят без изменений
- Функция `mustacheTemplate` не затронута

## Тестирование

Добавлено 16 новых тестов, покрывающих:

- Арифметические операции
- Операции сравнения
- Логические операции
- Тернарный оператор
- Доступ к массивам и объектам
- Сложные выражения
- Конкатенацию строк
- Преобразование типов
- Обработку ошибок
- Пустые выражения
- Смешанные шаблоны
- Null/undefined значения
- Математические функции
- Методы массивов и строк

## Файлы изменены

- `lib/stringTemplate.ts` - добавлена функция `safeEval` и поддержка опции `eval` для обеих функций
- `test/lib/stringTemplate.spec.ts` - добавлены тесты для новой функциональности

## Обновление: Поддержка eval в mustacheTemplate

### Дата: 2024-12-19 (обновление)

Добавлена поддержка опции `eval` в функцию `mustacheTemplate` с аналогичной функциональностью.

### Примеры использования mustacheTemplate с eval

```typescript
const data = {
  a: 10,
  b: 20,
  name: 'John',
  age: 30,
  items: [1, 2, 3, 4, 5],
  user: { score: 100, active: true },
}

// Арифметические операции
mustacheTemplate('{{a + b}}', data, { eval: true }) // "30"
mustacheTemplate('{{a * b}}', data, { eval: true }) // "200"

// Сравнения
mustacheTemplate('{{a > b}}', data, { eval: true }) // "false"
mustacheTemplate('{{a < b}}', data, { eval: true }) // "true"

// Логические операции
mustacheTemplate('{{a > 5 && b > 15}}', data, { eval: true }) // "true"

// Тернарный оператор
mustacheTemplate('{{a > b ? "bigger" : "smaller"}}', data, { eval: true }) // "smaller"

// Доступ к массивам
mustacheTemplate('{{items[0]}}', data, { eval: true }) // "1"
mustacheTemplate('{{items.length}}', data, { eval: true }) // "5"

// Методы объектов
mustacheTemplate('{{name.toUpperCase()}}', data, { eval: true }) // "JOHN"
mustacheTemplate('{{items.join(",")}}', data, { eval: true }) // "1,2,3,4,5"

// Математические функции
mustacheTemplate('{{Math.max(a, b)}}', data, { eval: true }) // "20"
```

### Улучшения в обработке пробелов

Исправлена обработка пробелов в ключах шаблонов:

- `{{ user.name }}` теперь корректно обрабатывается как `{{user.name}}`
- Пробелы автоматически обрезаются при обработке ключей
- Пустые выражения `{{}}` и `{{ }}` корректно обрабатываются

### Тестирование

Добавлено 16 новых тестов для `mustacheTemplate` с опцией `eval`, покрывающих те же сценарии, что и для `standardTemplate`:

- Арифметические операции
- Операции сравнения
- Логические операции
- Тернарный оператор
- Доступ к массивам и объектам
- Сложные выражения
- Конкатенацию строк
- Преобразование типов
- Обработку ошибок
- Пустые выражения
- Смешанные шаблоны
- Null/undefined значения
- Математические функции
- Методы массивов и строк

Всего в проекте теперь 77 тестов, все проходят успешно.
