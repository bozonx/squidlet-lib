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

    describe('eval option', () => {
      const evalTestData = {
        a: 10,
        b: 20,
        name: 'John',
        age: 30,
        items: [1, 2, 3, 4, 5],
        user: { score: 100, active: true },
        prices: { apple: 1.5, banana: 2.0 },
      }

      it('should evaluate arithmetic expressions', () => {
        expect(standardTemplate('${a + b}', evalTestData, { eval: true })).toBe(
          '30'
        )
        expect(standardTemplate('${a * b}', evalTestData, { eval: true })).toBe(
          '200'
        )
        expect(standardTemplate('${b - a}', evalTestData, { eval: true })).toBe(
          '10'
        )
        expect(standardTemplate('${b / a}', evalTestData, { eval: true })).toBe(
          '2'
        )
        expect(standardTemplate('${a % 3}', evalTestData, { eval: true })).toBe(
          '1'
        )
      })

      it('should evaluate comparison expressions', () => {
        expect(standardTemplate('${a > b}', evalTestData, { eval: true })).toBe(
          'false'
        )
        expect(standardTemplate('${a < b}', evalTestData, { eval: true })).toBe(
          'true'
        )
        expect(
          standardTemplate('${a === 10}', evalTestData, { eval: true })
        ).toBe('true')
        expect(
          standardTemplate('${a !== b}', evalTestData, { eval: true })
        ).toBe('true')
        expect(
          standardTemplate('${a >= 10}', evalTestData, { eval: true })
        ).toBe('true')
        expect(
          standardTemplate('${a <= 10}', evalTestData, { eval: true })
        ).toBe('true')
      })

      it('should evaluate logical expressions', () => {
        expect(
          standardTemplate('${a > 5 && b > 15}', evalTestData, { eval: true })
        ).toBe('true')
        expect(
          standardTemplate('${a > 15 || b > 15}', evalTestData, { eval: true })
        ).toBe('true')
        expect(
          standardTemplate('${!user.active}', evalTestData, { eval: true })
        ).toBe('false')
      })

      it('should evaluate ternary operator', () => {
        expect(
          standardTemplate('${a > b ? "bigger" : "smaller"}', evalTestData, {
            eval: true,
          })
        ).toBe('smaller')
        expect(
          standardTemplate(
            '${user.active ? "active" : "inactive"}',
            evalTestData,
            { eval: true }
          )
        ).toBe('active')
      })

      it('should evaluate array access with expressions', () => {
        expect(
          standardTemplate('${items[0]}', evalTestData, { eval: true })
        ).toBe('1')
        expect(
          standardTemplate('${items[a - 9]}', evalTestData, { eval: true })
        ).toBe('2')
        expect(
          standardTemplate('${items.length}', evalTestData, { eval: true })
        ).toBe('5')
      })

      it('should evaluate object property access', () => {
        expect(
          standardTemplate('${user.score}', evalTestData, { eval: true })
        ).toBe('100')
        expect(
          standardTemplate('${user.active}', evalTestData, { eval: true })
        ).toBe('true')
      })

      it('should evaluate complex expressions', () => {
        expect(
          standardTemplate('${(a + b) * 2}', evalTestData, { eval: true })
        ).toBe('60')
        expect(
          standardTemplate(
            '${user.score > 50 ? "high" : "low"}',
            evalTestData,
            { eval: true }
          )
        ).toBe('high')
        expect(
          standardTemplate('${items[0] + items[1]}', evalTestData, {
            eval: true,
          })
        ).toBe('3')
      })

      it('should handle string concatenation', () => {
        expect(
          standardTemplate('${name + " is " + age}', evalTestData, {
            eval: true,
          })
        ).toBe('John is 30')
        expect(
          standardTemplate('${"Hello " + name}', evalTestData, { eval: true })
        ).toBe('Hello John')
      })

      it('should handle type conversion', () => {
        expect(
          standardTemplate('${String(a)}', evalTestData, { eval: true })
        ).toBe('10')
        expect(
          standardTemplate('${Number("20")}', evalTestData, { eval: true })
        ).toBe('20')
        expect(
          standardTemplate('${Boolean(0)}', evalTestData, { eval: true })
        ).toBe('false')
      })

      it('should handle invalid expressions gracefully', () => {
        expect(
          standardTemplate('${invalidVariable}', evalTestData, { eval: true })
        ).toBe('')
        expect(
          standardTemplate('${items[10]}', evalTestData, { eval: true })
        ).toBe('')
        expect(
          standardTemplate('${user.nonexistent}', evalTestData, { eval: true })
        ).toBe('')
        expect(
          standardTemplate('${syntax error}', evalTestData, { eval: true })
        ).toBe('')
      })

      it('should handle empty expressions', () => {
        expect(standardTemplate('${}', evalTestData, { eval: true })).toBe('')
        expect(standardTemplate('${ }', evalTestData, { eval: true })).toBe('')
      })

      it('should work with mixed eval and non-eval templates', () => {
        const template = 'Name: ${name}, Sum: ${a + b}, Age: ${age}'
        expect(standardTemplate(template, evalTestData, { eval: true })).toBe(
          'Name: John, Sum: 30, Age: 30'
        )
      })

      it('should handle null and undefined values in expressions', () => {
        const nullData = { a: null, b: undefined, c: 10 }
        expect(standardTemplate('${a}', nullData, { eval: true })).toBe('')
        expect(standardTemplate('${b}', nullData, { eval: true })).toBe('')
        expect(standardTemplate('${c}', nullData, { eval: true })).toBe('10')
        expect(standardTemplate('${a || c}', nullData, { eval: true })).toBe(
          '10'
        )
      })

      it('should handle mathematical functions', () => {
        expect(
          standardTemplate('${Math.max(a, b)}', evalTestData, { eval: true })
        ).toBe('20')
        expect(
          standardTemplate('${Math.min(a, b)}', evalTestData, { eval: true })
        ).toBe('10')
        expect(
          standardTemplate('${Math.round(3.7)}', evalTestData, { eval: true })
        ).toBe('4')
      })

      it('should handle array methods', () => {
        expect(
          standardTemplate('${items.join(",")}', evalTestData, { eval: true })
        ).toBe('1,2,3,4,5')
        expect(
          standardTemplate('${items.slice(0, 2).join("-")}', evalTestData, {
            eval: true,
          })
        ).toBe('1-2')
      })

      it('should handle string methods', () => {
        expect(
          standardTemplate('${name.toUpperCase()}', evalTestData, {
            eval: true,
          })
        ).toBe('JOHN')
        expect(
          standardTemplate('${name.length}', evalTestData, { eval: true })
        ).toBe('4')
        expect(
          standardTemplate('${name.charAt(0)}', evalTestData, { eval: true })
        ).toBe('J')
      })
    })
  })
})
