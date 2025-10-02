# Добавлена поддержка опции markAtTheEnd в smartTruncate

## Дата: 2024-12-19

## Изменения

### Добавлена новая опция `markAtTheEnd` в интерфейс `SmartTruncateOptions`

- **Тип**: `boolean`
- **По умолчанию**: `true`
- **Описание**: Определяет, размещать ли маркер обрезания в конце текста

### Обновлена функция `smartTruncate`

- Добавлена поддержка опции `markAtTheEnd`
- Когда `markAtTheEnd: false`, функция просто обрезает строку до указанной длины без добавления маркера
- Логика проверки `markAtTheEnd` выполняется до проверки других опций для обеспечения корректной работы

### Обновлены вспомогательные функции

- `smartTruncateWithWordBoundaries` - добавлен параметр `markAtTheEnd`
- `smartTruncateWords` - добавлен параметр `markAtTheEnd`

### Добавлены тесты

- Базовые тесты для опции `markAtTheEnd`
- Тесты для комбинации `markAtTheEnd` с другими опциями
- Тесты для всех функций с поддержкой `markAtTheEnd`
- Расширенные тесты для граничных случаев

## Примеры использования

```typescript
// С маркером (по умолчанию)
smartTruncate('Hello World', 8) // 'Hello W…'

// Без маркера
smartTruncate('Hello World', 8, { markAtTheEnd: false }) // 'Hello Wo'

// С другими опциями
smartTruncate('Hello World Test', 10, {
  markAtTheEnd: false,
  respectWords: true,
}) // 'Hello Worl'
```

## Обратная совместимость

Изменения полностью обратно совместимы. По умолчанию `markAtTheEnd: true`, что сохраняет существующее поведение.
