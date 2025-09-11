import { mustacheTemplate, standardTemplate } from '../../lib/stringTemplate.js'

describe('lib/stringTemplate', () => {
  const testData = {
    user: {
      name: 'John',
      age: 30,
      address: { city: 'New York', street: null },
      hobbies: ['reading', null, 'gaming'],
      settings: null,
    },
    count: 0,
    active: false,
    empty: '',
  }

  describe('mustacheTemplate', () => {
    it('should handle null template', () => {
      expect(mustacheTemplate(null, testData)).toBe('')
      expect(mustacheTemplate(undefined, testData)).toBe('')
    })

    it('should handle null data', () => {
      const template = 'Hello {{user.name}}'
      expect(mustacheTemplate(template, null)).toBe(template)
      expect(mustacheTemplate(template, undefined)).toBe(template)
    })

    it('should handle empty template', () => {
      expect(mustacheTemplate('', testData)).toBe('')
    })

    it('should handle template without placeholders', () => {
      const template = 'Hello World'
      expect(mustacheTemplate(template, testData)).toBe('Hello World')
    })

    it('should handle null values in data', () => {
      const template =
        'Address: {{user.address.street}}, Settings: {{user.settings.enabled}}'
      expect(mustacheTemplate(template, testData)).toBe('Address: , Settings: ')
    })

    it('should handle null in arrays', () => {
      const template = 'Hobby: {{user.hobbies[1]}}'
      expect(mustacheTemplate(template, testData)).toBe('Hobby: ')
    })

    it('should handle falsy values correctly', () => {
      const template = 'Count: {{count}}, Active: {{active}}, Empty: {{empty}}'
      expect(mustacheTemplate(template, testData)).toBe(
        'Count: 0, Active: false, Empty: '
      )
    })

    it('should handle normal cases', () => {
      const template = 'Hello {{user.name}} from {{user.address.city}}'
      expect(mustacheTemplate(template, testData)).toBe(
        'Hello John from New York'
      )
    })

    it('should handle complex null paths', () => {
      const complexData = {
        level1: { level2: null, level3: { value: 'test' } },
      }
      const template =
        'Value: {{level1.level2.someProperty}}, Test: {{level1.level3.value}}'
      expect(mustacheTemplate(template, complexData)).toBe(
        'Value: , Test: test'
      )
    })

    it('should handle multiple occurrences of same key', () => {
      const template = '{{user.name}} is {{user.name}} and {{user.name}}'
      expect(mustacheTemplate(template, testData)).toBe('John is John and John')
    })

    it('should handle array indices correctly', () => {
      const template = 'First: {{user.hobbies[0]}}, Last: {{user.hobbies[2]}}'
      expect(mustacheTemplate(template, testData)).toBe(
        'First: reading, Last: gaming'
      )
    })

    it('should handle invalid array indices', () => {
      const template = 'Invalid: {{user.hobbies[5]}}, Out: {{user.hobbies[-1]}}'
      expect(mustacheTemplate(template, testData)).toBe('Invalid: , Out: ')
    })

    it('should handle non-existent paths', () => {
      const template = 'Missing: {{user.nonexistent.property}}'
      expect(mustacheTemplate(template, testData)).toBe('Missing: ')
    })

    it('should handle special characters in keys', () => {
      const specialData = {
        'key*with*asterisks': 'value3',
        'key+with+plus': 'value4',
        'key?with?question': 'value5',
        'key^with^caret': 'value6',
        key$with$dollar: 'value7',
        'key(with)parens': 'value9',
        'key|with|pipe': 'value10',
        'key\\with\\backslash': 'value11',
      }
      const template =
        '{{key*with*asterisks}} {{key+with+plus}} {{key?with?question}} {{key^with^caret}} {{key$with$dollar}} {{key(with)parens}} {{key|with|pipe}} {{key\\with\\backslash}}'
      expect(mustacheTemplate(template, specialData)).toBe(
        'value3 value4 value5 value6 value7 value9 value10 value11'
      )
    })

    it('should handle different data types conversion', () => {
      const typeData = {
        number: 42,
        boolean: true,
        object: { toString: () => 'object string' },
        array: [1, 2, 3],
        date: new Date('2023-01-01'),
        bigint: BigInt(123),
        symbol: Symbol('test'),
      }
      const template =
        'Number: {{number}}, Boolean: {{boolean}}, Object: {{object}}, Array: {{array}}, Date: {{date}}, BigInt: {{bigint}}, Symbol: {{symbol}}'
      const result = mustacheTemplate(template, typeData)
      expect(result).toContain('Number: 42')
      expect(result).toContain('Boolean: true')
      expect(result).toContain('Object: object string')
      expect(result).toContain('Array: 1,2,3')
      expect(result).toContain('Date:')
      expect(result).toContain('BigInt: 123')
      expect(result).toContain('Symbol: Symbol(test)')
    })

    it('should handle whitespace in template keys', () => {
      const template = 'Name: {{ user.name }}, Age: {{user.age }}'
      expect(mustacheTemplate(template, testData)).toBe(
        'Name: {{ user.name }}, Age: {{user.age }}'
      )
    })

    it('should handle nested arrays', () => {
      const nestedArrayData = {
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      }
      const template = 'Value: {{matrix[1][2]}}'
      expect(mustacheTemplate(template, nestedArrayData)).toBe('Value: 6')
    })

    it('should handle empty objects and arrays', () => {
      const emptyData = {
        emptyObj: {},
        emptyArr: [],
        nullObj: null,
        undefinedArr: undefined,
      }
      const template =
        'Empty obj: {{emptyObj}}, Empty arr: {{emptyArr}}, Null obj: {{nullObj}}, Undefined arr: {{undefinedArr}}'
      expect(mustacheTemplate(template, emptyData)).toBe(
        'Empty obj: [object Object], Empty arr: , Null obj: , Undefined arr: '
      )
    })

    it('should handle malformed template syntax', () => {
      const template = '{{user.name} {{user.age}} {{user.name'
      expect(mustacheTemplate(template, testData)).toBe(
        '{{user.name} 30 {{user.name'
      )
    })

    it('should handle very deep nesting', () => {
      const deepData = {
        level1: {
          level2: { level3: { level4: { level5: { value: 'deep value' } } } },
        },
      }
      const template = 'Deep: {{level1.level2.level3.level4.level5.value}}'
      expect(mustacheTemplate(template, deepData)).toBe('Deep: deep value')
    })

    it('should handle mixed array and object paths', () => {
      const mixedData = {
        items: [
          { name: 'item1', tags: ['tag1', 'tag2'] },
          { name: 'item2', tags: ['tag3', 'tag4'] },
        ],
      }
      const template = 'Item: {{items[0].name}}, Tag: {{items[1].tags[0]}}'
      expect(mustacheTemplate(template, mixedData)).toBe(
        'Item: item1, Tag: tag3'
      )
    })
  })

  describe('standardTemplate', () => {
    it('should handle null template', () => {
      expect(standardTemplate(null, testData)).toBe('')
      expect(standardTemplate(undefined, testData)).toBe('')
    })

    it('should handle null data', () => {
      const template = 'Hello ${user.name}'
      expect(standardTemplate(template, null)).toBe(template)
      expect(standardTemplate(template, undefined)).toBe(template)
    })

    it('should handle empty template', () => {
      expect(standardTemplate('', testData)).toBe('')
    })

    it('should handle template without placeholders', () => {
      const template = 'Hello World'
      expect(standardTemplate(template, testData)).toBe('Hello World')
    })

    it('should handle null values in data', () => {
      const template =
        'Address: ${user.address.street}, Settings: ${user.settings.enabled}'
      expect(standardTemplate(template, testData)).toBe('Address: , Settings: ')
    })

    it('should handle null in arrays', () => {
      const template = 'Hobby: ${user.hobbies[1]}'
      expect(standardTemplate(template, testData)).toBe('Hobby: ')
    })

    it('should handle falsy values correctly', () => {
      const template = 'Count: ${count}, Active: ${active}, Empty: ${empty}'
      expect(standardTemplate(template, testData)).toBe(
        'Count: 0, Active: false, Empty: '
      )
    })

    it('should handle normal cases', () => {
      const template = 'Hello ${user.name} from ${user.address.city}'
      expect(standardTemplate(template, testData)).toBe(
        'Hello John from New York'
      )
    })

    it('should handle complex null paths', () => {
      const complexData = {
        level1: { level2: null, level3: { value: 'test' } },
      }
      const template =
        'Value: ${level1.level2.someProperty}, Test: ${level1.level3.value}'
      expect(standardTemplate(template, complexData)).toBe(
        'Value: , Test: test'
      )
    })

    it('should handle multiple occurrences of same key', () => {
      const template = '${user.name} is ${user.name} and ${user.name}'
      expect(standardTemplate(template, testData)).toBe('John is John and John')
    })

    it('should handle array indices correctly', () => {
      const template = 'First: ${user.hobbies[0]}, Last: ${user.hobbies[2]}'
      expect(standardTemplate(template, testData)).toBe(
        'First: reading, Last: gaming'
      )
    })

    it('should handle invalid array indices', () => {
      const template = 'Invalid: ${user.hobbies[5]}, Out: ${user.hobbies[-1]}'
      expect(standardTemplate(template, testData)).toBe('Invalid: , Out: ')
    })

    it('should handle non-existent paths', () => {
      const template = 'Missing: ${user.nonexistent.property}'
      expect(standardTemplate(template, testData)).toBe('Missing: ')
    })

    it('should handle special characters in keys', () => {
      const specialData = {
        'key*with*asterisks': 'value3',
        'key+with+plus': 'value4',
        'key?with?question': 'value5',
        'key^with^caret': 'value6',
        key$with$dollar: 'value7',
        'key(with)parens': 'value9',
        'key|with|pipe': 'value10',
        'key\\with\\backslash': 'value11',
      }
      const template =
        '${key*with*asterisks} ${key+with+plus} ${key?with?question} ${key^with^caret} ${key$with$dollar} ${key(with)parens} ${key|with|pipe} ${key\\with\\backslash}'
      expect(standardTemplate(template, specialData)).toBe(
        'value3 value4 value5 value6 value7 value9 value10 value11'
      )
    })

    it('should handle different data types conversion', () => {
      const typeData = {
        number: 42,
        boolean: true,
        object: { toString: () => 'object string' },
        array: [1, 2, 3],
        date: new Date('2023-01-01'),
        bigint: BigInt(123),
        symbol: Symbol('test'),
      }
      const template =
        'Number: ${number}, Boolean: ${boolean}, Object: ${object}, Array: ${array}, Date: ${date}, BigInt: ${bigint}, Symbol: ${symbol}'
      const result = standardTemplate(template, typeData)
      expect(result).toContain('Number: 42')
      expect(result).toContain('Boolean: true')
      expect(result).toContain('Object: object string')
      expect(result).toContain('Array: 1,2,3')
      expect(result).toContain('Date:')
      expect(result).toContain('BigInt: 123')
      expect(result).toContain('Symbol: Symbol(test)')
    })

    it('should handle whitespace in template keys', () => {
      const template = 'Name: ${ user.name }, Age: ${user.age }'
      expect(standardTemplate(template, testData)).toBe('Name: , Age: ')
    })

    it('should handle nested arrays', () => {
      const nestedArrayData = {
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      }
      const template = 'Value: ${matrix[1][2]}'
      expect(standardTemplate(template, nestedArrayData)).toBe('Value: 6')
    })

    it('should handle empty objects and arrays', () => {
      const emptyData = {
        emptyObj: {},
        emptyArr: [],
        nullObj: null,
        undefinedArr: undefined,
      }
      const template =
        'Empty obj: ${emptyObj}, Empty arr: ${emptyArr}, Null obj: ${nullObj}, Undefined arr: ${undefinedArr}'
      expect(standardTemplate(template, emptyData)).toBe(
        'Empty obj: [object Object], Empty arr: , Null obj: , Undefined arr: '
      )
    })

    it('should handle malformed template syntax', () => {
      const template = '${user.name} ${user.age} ${user.name'
      expect(standardTemplate(template, testData)).toBe('John 30 ${user.name')
    })

    it('should handle very deep nesting', () => {
      const deepData = {
        level1: {
          level2: { level3: { level4: { level5: { value: 'deep value' } } } },
        },
      }
      const template = 'Deep: ${level1.level2.level3.level4.level5.value}'
      expect(standardTemplate(template, deepData)).toBe('Deep: deep value')
    })

    it('should handle mixed array and object paths', () => {
      const mixedData = {
        items: [
          { name: 'item1', tags: ['tag1', 'tag2'] },
          { name: 'item2', tags: ['tag3', 'tag4'] },
        ],
      }
      const template = 'Item: ${items[0].name}, Tag: ${items[1].tags[0]}'
      expect(standardTemplate(template, mixedData)).toBe(
        'Item: item1, Tag: tag3'
      )
    })

    it('should handle dollar sign escaping in template', () => {
      const template = 'Price: $${price}, Total: ${total}'
      const priceData = { price: 100, total: 150 }
      expect(standardTemplate(template, priceData)).toBe(
        'Price: $100, Total: 150'
      )
    })

    it('should handle complex regex patterns in keys', () => {
      const regexData = {
        'test*': 'value3',
        'test+': 'value4',
        'test?': 'value5',
        'test^': 'value6',
        test$: 'value7',
        'test{': 'value8',
        'test(': 'value9',
        'test|': 'value10',
        'test\\': 'value11',
      }
      const template =
        '${test*} ${test+} ${test?} ${test^} ${test$} ${test{} ${test(} ${test|} ${test\\}'
      expect(standardTemplate(template, regexData)).toBe(
        'value3 value4 value5 value6 value7 value8 value9 value10 value11'
      )
    })

    it('should handle malformed array indices gracefully', () => {
      const testData = { items: ['item1', 'item2', 'item3'] }

      // Тестируем различные некорректные форматы индексов
      const templates = [
        '${items[Number(params]}', // Ваш случай
        '${items[abc]}', // Нечисловой индекс
        '${items[1.5]}', // Дробный индекс
        '${items[1a]}', // Смешанный индекс
        '${items[1,2]}', // Множественные индексы
        '${items[1+2]}', // Выражение
      ]

      templates.forEach((template) => {
        expect(standardTemplate(template, testData)).toBe(template)
      })
    })
  })
})
