import {
  smartTruncate,
  smartTruncateWithWordBoundaries,
  smartTruncateWords,
} from '../../lib/smartTruncate'

describe('smartTruncate', () => {
  describe('basic functionality', () => {
    test('should return original string if length is too small', () => {
      expect(smartTruncate('Hello', 3)).toBe('Hello')
      expect(smartTruncate('Hello', 4)).toBe('Hello')
    })

    test('should return original string if input is not a string', () => {
      expect(smartTruncate(null as any, 10)).toBe(null)
      expect(smartTruncate(undefined as any, 10)).toBe(undefined)
      expect(smartTruncate(123 as any, 10)).toBe(123)
    })

    test('should return original string if mark is not a string', () => {
      expect(smartTruncate('Hello World', 8, { mark: null as any })).toBe(
        'Hello World'
      )
    })

    test('should return original string if string is shorter than target length', () => {
      expect(smartTruncate('Hello', 10)).toBe('Hello')
    })

    test('should truncate at the end by default', () => {
      expect(smartTruncate('Hello World', 8)).toBe('Hello W…')
      expect(smartTruncate('Steve Miller', 8)).toBe('Steve M…')
    })

    test('should truncate at specified position', () => {
      expect(smartTruncate('Steve Miller', 9, { position: 4 })).toBe(
        'Stev…ller'
      )
    })

    test('should handle custom mark', () => {
      expect(smartTruncate('Hello World', 8, { mark: '...' })).toBe('Hello...')
    })

    test('should remove returns and normalize spaces', () => {
      expect(smartTruncate('Hello\n\nWorld', 8)).toBe('Hello W…')
      expect(smartTruncate('Hello    World', 8)).toBe('Hello W…')
    })

    test('should not remove returns when removeReturns is false', () => {
      expect(smartTruncate('Hello\nWorld', 8, { removeReturns: false })).toBe(
        'Hello\nW…'
      )
    })

    test('should not add mark when markAtTheEnd is false', () => {
      expect(smartTruncate('Hello World', 8, { markAtTheEnd: false })).toBe(
        'Hello Wo'
      )
      expect(smartTruncate('Steve Miller', 8, { markAtTheEnd: false })).toBe(
        'Steve Mi'
      )
    })

    test('should add mark when markAtTheEnd is true (default)', () => {
      expect(smartTruncate('Hello World', 8, { markAtTheEnd: true })).toBe(
        'Hello W…'
      )
      expect(smartTruncate('Hello World', 8)).toBe('Hello W…')
    })
  })

  describe('edge cases', () => {
    test('should handle empty string', () => {
      expect(smartTruncate('', 10)).toBe('')
    })

    test('should handle string with only spaces', () => {
      expect(smartTruncate('   ', 5)).toBe('')
    })

    test('should handle position at the end', () => {
      expect(smartTruncate('Hello World', 8, { position: 7 })).toBe('Hello W…')
    })

    test('should handle position beyond string length', () => {
      expect(smartTruncate('Hello', 8, { position: 10 })).toBe('Hello')
    })

    test('should handle very long mark', () => {
      expect(smartTruncate('Hello World', 8, { mark: '...' })).toBe('Hello...')
    })
  })

  describe('respectWords option', () => {
    test('should respect word boundaries when enabled', () => {
      expect(
        smartTruncate('Hello World Test', 10, { respectWords: true })
      ).toBe('Hello…')
      expect(smartTruncate('This is a test', 9, { respectWords: true })).toBe(
        'This is…'
      )
    })

    test('should fall back to character truncation if no word boundary found', () => {
      expect(smartTruncate('HelloWorld', 8, { respectWords: true })).toBe(
        'HelloWo…'
      )
    })

    test('should respect word boundaries without mark when markAtTheEnd is false', () => {
      expect(
        smartTruncate('Hello World Test', 10, {
          respectWords: true,
          markAtTheEnd: false,
        })
      ).toBe('Hello Worl')
      expect(
        smartTruncate('This is a test', 9, {
          respectWords: true,
          markAtTheEnd: false,
        })
      ).toBe('This is a')
    })
  })
})

describe('smartTruncateWithWordBoundaries', () => {
  test('should return original string if shorter than target', () => {
    expect(smartTruncateWithWordBoundaries('Hello', 10)).toBe('Hello')
  })

  test('should truncate at word boundary', () => {
    expect(smartTruncateWithWordBoundaries('Hello World Test', 10)).toBe(
      'Hello…'
    )
    expect(smartTruncateWithWordBoundaries('This is a test', 9)).toBe(
      'This is…'
    )
  })

  test('should handle no word boundaries', () => {
    expect(smartTruncateWithWordBoundaries('HelloWorld', 8)).toBe('HelloWo…')
  })

  test('should handle custom mark', () => {
    expect(smartTruncateWithWordBoundaries('Hello World', 8, '...')).toBe(
      'Hello...'
    )
  })

  test('should handle very short target length', () => {
    expect(smartTruncateWithWordBoundaries('Hello World', 2)).toBe('H…')
    expect(smartTruncateWithWordBoundaries('Hello World', 1)).toBe('…')
  })

  test('should handle space at beginning', () => {
    expect(smartTruncateWithWordBoundaries(' Hello World', 8)).toBe(' Hello…')
  })

  test('should not add mark when markAtTheEnd is false', () => {
    expect(
      smartTruncateWithWordBoundaries('Hello World Test', 10, '…', false)
    ).toBe('Hello Worl')
    expect(
      smartTruncateWithWordBoundaries('This is a test', 9, '…', false)
    ).toBe('This is a')
  })

  test('should add mark when markAtTheEnd is true (default)', () => {
    expect(
      smartTruncateWithWordBoundaries('Hello World Test', 10, '…', true)
    ).toBe('Hello…')
    expect(smartTruncateWithWordBoundaries('Hello World Test', 10)).toBe(
      'Hello…'
    )
  })
})

describe('smartTruncateWords', () => {
  test('should work as alias for smartTruncateWithWordBoundaries', () => {
    expect(smartTruncateWords('Hello World Test', 10)).toBe('Hello…')
    expect(smartTruncateWords('This is a test', 9)).toBe('This is…')
  })

  test('should support markAtTheEnd parameter', () => {
    expect(smartTruncateWords('Hello World Test', 10, '…', false)).toBe(
      'Hello Worl'
    )
    expect(smartTruncateWords('This is a test', 9, '…', false)).toBe(
      'This is a'
    )
    expect(smartTruncateWords('Hello World Test', 10, '…', true)).toBe('Hello…')
  })
})

describe('Extended test cases', () => {
  describe('Unicode and special characters', () => {
    test('should handle Unicode characters', () => {
      expect(smartTruncate('Привет мир', 8)).toBe('Привет …')
      expect(smartTruncate('Hello 世界', 8)).toBe('Hello 世界')
      expect(smartTruncate('🚀 Rocket', 8)).toBe('🚀 Rock…')
    })

    test('should handle emojis and special symbols', () => {
      expect(smartTruncate('Hello 😀 World', 10)).toBe('Hello 😀 …')
      expect(smartTruncate('Test @#$%', 8)).toBe('Test @#…')
      expect(smartTruncate('Math: 2² + 3³', 10)).toBe('Math: 2² …')
    })

    test('should handle mixed languages', () => {
      expect(smartTruncate('Hello Привет 你好', 12)).toBe('Hello Приве…')
      expect(smartTruncate('Test тест 测试', 10)).toBe('Test тест…')
    })
  })

  describe('Complex word boundary scenarios', () => {
    test('should handle multiple spaces between words', () => {
      expect(
        smartTruncate('Hello    World   Test', 12, { respectWords: true })
      ).toBe('Hello…')
      expect(
        smartTruncate('This   is   a   test', 10, { respectWords: true })
      ).toBe('This is…')
    })

    test('should handle tabs and mixed whitespace', () => {
      expect(
        smartTruncate('Hello\tWorld\tTest', 10, { respectWords: true })
      ).toBe('Hello…')
      expect(
        smartTruncate('This\tis\ta\ttest', 8, { respectWords: true })
      ).toBe('This…')
    })

    test('should handle words with punctuation', () => {
      expect(
        smartTruncate('Hello, World! Test?', 12, { respectWords: true })
      ).toBe('Hello,…')
      expect(smartTruncate('This is a test.', 10, { respectWords: true })).toBe(
        'This is…'
      )
    })

    test('should handle hyphenated words', () => {
      expect(
        smartTruncate('Hello-World Test', 12, { respectWords: true })
      ).toBe('Hello-World…')
      expect(
        smartTruncate('This is a test-case', 15, { respectWords: true })
      ).toBe('This is a…')
    })
  })

  describe('Position-based truncation edge cases', () => {
    test('should handle position at beginning', () => {
      expect(smartTruncate('Hello World', 8, { position: 0 })).toBe('…o World')
      expect(smartTruncate('Test String', 7, { position: 0 })).toBe('…String')
    })

    test('should handle position in middle', () => {
      expect(smartTruncate('Hello World Test', 10, { position: 5 })).toBe(
        'Hello…Test'
      )
      expect(smartTruncate('This is a test', 9, { position: 4 })).toBe(
        'This…test'
      )
    })

    test('should handle position near end', () => {
      expect(smartTruncate('Hello World', 8, { position: 8 })).toBe('Hello W…')
      expect(smartTruncate('Test String', 7, { position: 9 })).toBe('Test S…')
    })

    test('should handle negative position', () => {
      expect(smartTruncate('Hello World', 8, { position: -1 })).toBe(
        '…lo World'
      )
      expect(smartTruncate('Test String', 7, { position: -5 })).toBe(
        '…Test String'
      )
    })
  })

  describe('Custom mark variations', () => {
    test('should handle single character marks', () => {
      expect(smartTruncate('Hello World', 8, { mark: '*' })).toBe('Hello W*')
      expect(smartTruncate('Test String', 7, { mark: '#' })).toBe('Test S#')
    })

    test('should handle multi-character marks', () => {
      expect(smartTruncate('Hello World', 8, { mark: '...' })).toBe('Hello...')
      expect(smartTruncate('Test String', 7, { mark: '---' })).toBe('Test---')
    })

    test('should handle Unicode marks', () => {
      expect(smartTruncate('Hello World', 8, { mark: '→' })).toBe('Hello W→')
      expect(smartTruncate('Test String', 7, { mark: '…' })).toBe('Test S…')
    })

    test('should handle very long marks', () => {
      expect(smartTruncate('Hello World', 8, { mark: '[...]' })).toBe(
        'Hel[...]'
      )
      expect(smartTruncate('Test String', 7, { mark: '----' })).toBe('Tes----')
    })
  })

  describe('RemoveReturns variations', () => {
    test('should handle multiple newlines', () => {
      expect(
        smartTruncate('Hello\n\n\nWorld', 8, { removeReturns: true })
      ).toBe('Hello W…')
      expect(smartTruncate('Test\n\nString', 7, { removeReturns: true })).toBe(
        'Test S…'
      )
    })

    test('should preserve newlines when removeReturns is false', () => {
      expect(smartTruncate('Hello\n\nWorld', 8, { removeReturns: false })).toBe(
        'Hello\n\n…'
      )
      expect(smartTruncate('Test\nString', 7, { removeReturns: false })).toBe(
        'Test\nS…'
      )
    })

    test('should handle mixed whitespace with newlines', () => {
      expect(smartTruncate('Hello \n World', 8, { removeReturns: true })).toBe(
        'Hello W…'
      )
      expect(smartTruncate('Test \n String', 7, { removeReturns: false })).toBe(
        'Test \n…'
      )
    })
  })

  describe('Very short strings', () => {
    test('should handle strings shorter than minLength', () => {
      expect(smartTruncate('Hi', 10)).toBe('Hi')
      expect(smartTruncate('OK', 10)).toBe('OK')
      expect(smartTruncate('No', 10)).toBe('No')
    })

    test('should handle empty and whitespace-only strings', () => {
      expect(smartTruncate('', 10)).toBe('')
      expect(smartTruncate('   ', 10)).toBe('')
      expect(smartTruncate('\t\n ', 10)).toBe('')
    })
  })

  describe('Very long strings', () => {
    test('should handle very long strings efficiently', () => {
      const longString = 'A'.repeat(1000) + ' B'
      const result = smartTruncate(longString, 10)
      expect(result.length).toBe(10)
      expect(result).toMatch(/^A+…$/)
    })

    test('should handle very long strings with word boundaries', () => {
      const longString = 'A'.repeat(1000) + ' B'
      const result = smartTruncate(longString, 10, { respectWords: true })
      expect(result.length).toBe(10)
      expect(result).toMatch(/^A+…$/)
    })
  })

  describe('Performance and edge cases', () => {
    test('should handle strings with only spaces', () => {
      expect(smartTruncate('     ', 10)).toBe('')
      expect(smartTruncate('   \t  \n  ', 10)).toBe('')
    })

    test('should handle strings with only punctuation', () => {
      expect(smartTruncate('!!!', 10)).toBe('!!!')
      expect(smartTruncate('???', 10)).toBe('???')
    })

    test('should handle strings with only numbers', () => {
      expect(smartTruncate('12345', 10)).toBe('12345')
      expect(smartTruncate('1234567890', 8)).toBe('1234567…')
    })

    test('should handle strings with only special characters', () => {
      expect(smartTruncate('@#$%^&*()', 10)).toBe('@#$%^&*()')
      expect(smartTruncate('@#$%^&*()', 8)).toBe('@#$%^&*…')
    })
  })

  describe('smartTruncateWithWordBoundaries extended tests', () => {
    test('should handle strings with no spaces', () => {
      expect(smartTruncateWithWordBoundaries('HelloWorld', 8)).toBe('HelloWo…')
      expect(smartTruncateWithWordBoundaries('TestString', 7)).toBe('TestSt…')
    })

    test('should handle strings with spaces at beginning', () => {
      expect(smartTruncateWithWordBoundaries(' Hello World', 8)).toBe(' Hello…')
      expect(smartTruncateWithWordBoundaries('  Test String', 7)).toBe(' …')
    })

    test('should handle strings with spaces at end', () => {
      expect(smartTruncateWithWordBoundaries('Hello World ', 8)).toBe('Hello…')
      expect(smartTruncateWithWordBoundaries('Test String ', 7)).toBe('Test…')
    })

    test('should handle strings with multiple consecutive spaces', () => {
      expect(smartTruncateWithWordBoundaries('Hello   World', 8)).toBe(
        'Hello …'
      )
      expect(smartTruncateWithWordBoundaries('Test    String', 7)).toBe(
        'Test …'
      )
    })

    test('should handle very short target lengths', () => {
      expect(smartTruncateWithWordBoundaries('Hello World', 3)).toBe('He…')
      expect(smartTruncateWithWordBoundaries('Test String', 2)).toBe('T…')
      expect(smartTruncateWithWordBoundaries('Hello World', 1)).toBe('…')
    })

    test('should handle custom marks with word boundaries', () => {
      expect(smartTruncateWithWordBoundaries('Hello World', 8, '...')).toBe(
        'Hello...'
      )
      expect(smartTruncateWithWordBoundaries('Test String', 7, '---')).toBe(
        'Test---'
      )
    })
  })

  describe('Combined options testing', () => {
    test('should combine respectWords with custom mark', () => {
      expect(
        smartTruncate('Hello World Test', 10, {
          respectWords: true,
          mark: '...',
        })
      ).toBe('Hello...')
      expect(
        smartTruncate('This is a test', 9, { respectWords: true, mark: '---' })
      ).toBe('This---')
    })

    test('should combine position with custom mark', () => {
      expect(
        smartTruncate('Hello World', 8, { position: 4, mark: '...' })
      ).toBe('Hell...d')
      expect(
        smartTruncate('Test String', 7, { position: 3, mark: '---' })
      ).toBe('Tes---g')
    })

    test('should combine removeReturns with respectWords', () => {
      expect(
        smartTruncate('Hello\nWorld Test', 10, {
          respectWords: true,
          removeReturns: true,
        })
      ).toBe('Hello…')
      expect(
        smartTruncate('This\nis a test', 9, {
          respectWords: true,
          removeReturns: false,
        })
      ).toBe('This\nis…')
    })

    test('should combine all options', () => {
      expect(
        smartTruncate('Hello\nWorld Test', 10, {
          respectWords: true,
          removeReturns: true,
          mark: '...',
          position: 5,
        })
      ).toBe('Hello...')
    })

    test('should combine markAtTheEnd with other options', () => {
      expect(
        smartTruncate('Hello World Test', 10, {
          markAtTheEnd: false,
          respectWords: true,
        })
      ).toBe('Hello Worl')
      expect(
        smartTruncate('Hello World', 8, { markAtTheEnd: false, position: 4 })
      ).toBe('Hello Wo')
      expect(
        smartTruncate('Hello World', 8, { markAtTheEnd: false, mark: '...' })
      ).toBe('Hello Wo')
    })
  })

  describe('markAtTheEnd option tests', () => {
    test('should truncate without mark when markAtTheEnd is false', () => {
      expect(smartTruncate('Hello World', 8, { markAtTheEnd: false })).toBe(
        'Hello Wo'
      )
      expect(smartTruncate('This is a test', 10, { markAtTheEnd: false })).toBe(
        'This is a '
      )
      expect(smartTruncate('Programming', 6, { markAtTheEnd: false })).toBe(
        'Progra'
      )
    })

    test('should work with custom marks when markAtTheEnd is false', () => {
      expect(
        smartTruncate('Hello World', 8, { markAtTheEnd: false, mark: '...' })
      ).toBe('Hello Wo')
      expect(
        smartTruncate('Test String', 7, { markAtTheEnd: false, mark: '---' })
      ).toBe('Test St')
    })

    test('should work with position when markAtTheEnd is false', () => {
      expect(
        smartTruncate('Hello World', 8, { markAtTheEnd: false, position: 4 })
      ).toBe('Hello Wo')
      expect(
        smartTruncate('Test String', 7, { markAtTheEnd: false, position: 2 })
      ).toBe('Test St')
    })

    test('should work with respectWords when markAtTheEnd is false', () => {
      expect(
        smartTruncate('Hello World Test', 10, {
          markAtTheEnd: false,
          respectWords: true,
        })
      ).toBe('Hello Worl')
      expect(
        smartTruncate('This is a test', 9, {
          markAtTheEnd: false,
          respectWords: true,
        })
      ).toBe('This is a')
    })

    test('should work with removeReturns when markAtTheEnd is false', () => {
      expect(
        smartTruncate('Hello\nWorld', 8, {
          markAtTheEnd: false,
          removeReturns: true,
        })
      ).toBe('Hello Wo')
      expect(
        smartTruncate('Test\nString', 7, {
          markAtTheEnd: false,
          removeReturns: false,
        })
      ).toBe('Test\nSt')
    })

    test('should handle edge cases with markAtTheEnd false', () => {
      expect(smartTruncate('Hi', 10, { markAtTheEnd: false })).toBe('Hi')
      expect(smartTruncate('', 10, { markAtTheEnd: false })).toBe('')
      expect(smartTruncate('Hello', 5, { markAtTheEnd: false })).toBe('Hello')
    })

    test('should handle very short target lengths with markAtTheEnd false', () => {
      expect(smartTruncate('Hello World', 3, { markAtTheEnd: false })).toBe(
        'Hello World'
      )
      expect(smartTruncate('Test String', 1, { markAtTheEnd: false })).toBe(
        'Test String'
      )
      expect(smartTruncate('Hello World', 0, { markAtTheEnd: false })).toBe(
        'Hello World'
      )
    })
  })

  describe('Performance tests', () => {
    test('should handle very large strings efficiently', () => {
      const startTime = Date.now()
      const largeString = 'A'.repeat(100000) + ' B'
      const result = smartTruncate(largeString, 10)
      const endTime = Date.now()

      expect(result.length).toBe(10)
      expect(result).toMatch(/^A+…$/)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
    })

    test('should handle very large strings with word boundaries efficiently', () => {
      const startTime = Date.now()
      const largeString = 'A'.repeat(100000) + ' B'
      const result = smartTruncate(largeString, 10, { respectWords: true })
      const endTime = Date.now()

      expect(result.length).toBe(10)
      expect(result).toMatch(/^A+…$/)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
    })

    test('should handle strings with many spaces efficiently', () => {
      const startTime = Date.now()
      const spacedString =
        'A'.repeat(1000) + '   ' + 'B'.repeat(1000) + '   ' + 'C'.repeat(1000)
      const result = smartTruncate(spacedString, 20, { respectWords: true })
      const endTime = Date.now()

      expect(result.length).toBe(20)
      expect(endTime - startTime).toBeLessThan(50) // Should complete in less than 50ms
    })

    test('should handle strings with many newlines efficiently', () => {
      const startTime = Date.now()
      const newlineString =
        'A'.repeat(1000) + '\n' + 'B'.repeat(1000) + '\n' + 'C'.repeat(1000)
      const result = smartTruncate(newlineString, 20, { removeReturns: true })
      const endTime = Date.now()

      expect(result.length).toBe(20)
      expect(endTime - startTime).toBeLessThan(50) // Should complete in less than 50ms
    })
  })
})
