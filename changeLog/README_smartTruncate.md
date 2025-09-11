# SmartTruncate - Умное обрезание строк

## Описание

Функция `smartTruncate` предназначена для обрезания строк с добавлением маркера (по умолчанию многоточия). В библиотеке представлены две версии:

1. **Оригинальная функция** - обрезает строку по символам
2. **Улучшенная функция** - обрезает строку с учетом границ слов

## Проблемы оригинальной функции

Оригинальная функция `smartTruncate` имеет существенный недостаток - она **не учитывает границы слов**. Это приводит к нечитаемым результатам:

```javascript
// Проблемные случаи:
smartTruncate('Hello World', 7) // "Hello …" - обрезает слово "World"
smartTruncate('This is a test', 9) // "This is …" - обрезает слово "a"
smartTruncate('Programming is fun', 12) // "Programming…" - обрезает слово "fun"
```

## Решения в улучшенной версии

### 1. Параметр `respectWords`

Добавлен новый параметр `respectWords` в опции функции:

```typescript
interface SmartTruncateOptions {
  mark?: string
  position?: number
  respectWords?: boolean // Новый параметр
}
```

### 2. Новые функции

- `smartTruncateWithWordBoundaries()` - внутренняя функция для умного обрезания
- `smartTruncateWords()` - простая функция для умного обрезания

## Использование

### Оригинальная функция (по умолчанию)

```typescript
import { smartTruncate } from 'squidlet-lib'

// Обрезание по символам (старая логика)
smartTruncate('Hello World', 8) // "Hello W…"
smartTruncate('This is a test', 10) // "This is a…"
```

### Улучшенная функция с учетом слов

```typescript
import { smartTruncate, smartTruncateWords } from 'squidlet-lib'

// Способ 1: Использование параметра respectWords
smartTruncate('Hello World', 7, { respectWords: true }) // "Hello…"
smartTruncate('This is a test', 9, { respectWords: true }) // "This is…"
smartTruncate('Programming is fun', 12, { respectWords: true }) // "Programming…"

// Способ 2: Использование специальной функции
smartTruncateWords('Hello World', 7) // "Hello…"
smartTruncateWords('This is a test', 9) // "This is…"
smartTruncateWords('Programming is fun', 12) // "Programming…"
```

### Сравнение результатов

| Текст                   | Длина | Оригинальная      | Улучшенная       |
| ----------------------- | ----- | ----------------- | ---------------- |
| "Hello World"           | 7     | "Hello …"         | "Hello…"         |
| "This is a test"        | 9     | "This is …"       | "This is…"       |
| "Programming is fun"    | 12    | "Programming…"    | "Programming…"   |
| "JavaScript is awesome" | 15    | "JavaScript is …" | "JavaScript is…" |

## Особенности работы

### Логика умного обрезания

1. **Поиск пробела**: Функция ищет последний пробел в обрезанной части строки
2. **Обрезание по границе**: Если пробел найден, обрезание происходит по границе слова
3. **Fallback**: Если пробел не найден, используется обычная логика обрезания

### Обработка крайних случаев

- **Длинные слова без пробелов**: Обрезаются по символам
- **Короткие строки**: Возвращаются без изменений
- **Пустые строки**: Возвращаются как есть
- **Неверные параметры**: Возвращается исходная строка

## Рекомендации по использованию

### Когда использовать `respectWords: true`

- **UI элементы** (заголовки, описания, карточки)
- **Пользовательский контент** (комментарии, отзывы)
- **Читаемые тексты** (статьи, новости)

### Когда использовать оригинальную логику

- **Технические логи** (отладочная информация)
- **Системные сообщения** (ошибки, предупреждения)
- **Коды, идентификаторы** (где важна точная длина)

## Примеры использования

### В React компоненте

```typescript
import { smartTruncateWords } from 'squidlet-lib'

const ProductCard = ({ title, description }) => {
  return (
    <div className="product-card">
      <h3>{smartTruncateWords(title, 30)}</h3>
      <p>{smartTruncateWords(description, 100)}</p>
    </div>
  )
}
```

### В Node.js приложении

```typescript
import { smartTruncate } from 'squidlet-lib'

// Для пользовательского интерфейса
const userFriendlyTruncate = (text: string, length: number) => {
  return smartTruncate(text, length, { respectWords: true })
}

// Для технических логов
const technicalTruncate = (text: string, length: number) => {
  return smartTruncate(text, length) // Без respectWords
}
```

## Обратная совместимость

Все изменения полностью обратно совместимы:

- По умолчанию `respectWords = false`
- Существующий код продолжает работать без изменений
- Новые функции являются дополнительными

## Производительность

Улучшенная функция имеет минимальные накладные расходы:

- Один дополнительный поиск `lastIndexOf(' ')`
- Несколько дополнительных проверок условий
- Время выполнения: O(n), где n - длина строки
