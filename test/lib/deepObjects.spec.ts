import {
  mergeDeepObjects,
  cloneDeepObject,
  deepGet,
  splitDeepPath,
} from '../../lib/index.js'

describe('lib/deepObjects', () => {
  it('mergeDeepObjects', () => {
    const top = { top: 'top', nested: { nestedTop: 'top' } }
    const bottom = {
      top: 'bottom',
      bottom: 'bottom',
      nested: { nestedTop: 'bottom', nestedBottom: 'bottom' },
    }

    expect(mergeDeepObjects(top, bottom)).toEqual({
      top: 'top',
      bottom: 'bottom',
      nested: { nestedTop: 'top', nestedBottom: 'bottom' },
    })
    // not mutated
    expect(top).toEqual({ top: 'top', nested: { nestedTop: 'top' } })
    // set undefined obviously
    expect(
      mergeDeepObjects({ top: undefined }, { top: 'top', bottom: 'bottom' })
    ).toEqual({ bottom: 'bottom' })
    expect(mergeDeepObjects({ top: undefined, param: 1 })).toEqual({ param: 1 })
    expect(
      mergeDeepObjects(undefined, { bottom: undefined, param: 1 })
    ).toEqual({ bottom: undefined, param: 1 })
  })

  it('mergeDeepObjects - clone arrays - not mutate', () => {
    const arr = [1]
    const top = { arr }
    const bottom = {}

    const result = mergeDeepObjects(top, bottom)

    expect(result).toEqual({ arr: [1] })
    expect(arr).not.toBe(result.arr)
  })

  it('cloneDeepObject', () => {
    expect(cloneDeepObject()).toEqual({})
    expect(cloneDeepObject({ a: undefined })).toEqual({ a: undefined })

    const obj = { a: 1 }
    expect(cloneDeepObject(obj)).toEqual({ a: 1 })
    expect(cloneDeepObject(obj)).not.toBe(obj)

    const arr = [1]
    const objWithArr = { arr }
    expect(cloneDeepObject(objWithArr)).toEqual({ arr: [1] })
    expect(cloneDeepObject(objWithArr).arr).not.toBe(arr)
  })

  describe('deepGet', () => {
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
      arr: [1, 2, 3],
    }

    it('should handle null and undefined inputs', () => {
      expect(deepGet(null, 'user.name')).toBeUndefined()
      expect(deepGet(undefined, 'user.name')).toBeUndefined()
      expect(deepGet(testData, null as any)).toBeUndefined()
      expect(deepGet(testData, undefined as any)).toBeUndefined()
    })

    it('should handle normal object paths', () => {
      expect(deepGet(testData, 'user.name')).toBe('John')
      expect(deepGet(testData, 'user.address.city')).toBe('New York')
      expect(deepGet(testData, 'count')).toBe(0)
      expect(deepGet(testData, 'active')).toBe(false)
    })

    it('should handle array indices correctly', () => {
      expect(deepGet(testData, 'arr[0]')).toBe(1)
      expect(deepGet(testData, 'arr[1]')).toBe(2)
      expect(deepGet(testData, 'arr[2]')).toBe(3)
      expect(deepGet(testData, 'user.hobbies[0]')).toBe('reading')
      expect(deepGet(testData, 'user.hobbies[1]')).toBe(null)
      expect(deepGet(testData, 'user.hobbies[2]')).toBe('gaming')
    })

    it('should handle negative array indices', () => {
      // Отрицательные индексы должны возвращать undefined
      expect(deepGet(testData, 'arr[-1]')).toBeUndefined()
      expect(deepGet(testData, 'user.hobbies[-1]')).toBeUndefined()
    })

    it('should handle non-numeric array indices', () => {
      // Нечисловые индексы должны возвращать undefined
      expect(deepGet(testData, 'arr[abc]')).toBeUndefined()
      expect(deepGet(testData, 'user.hobbies[invalid]')).toBeUndefined()
    })

    it('should handle out of bounds array indices', () => {
      expect(deepGet(testData, 'arr[10]')).toBeUndefined()
      expect(deepGet(testData, 'user.hobbies[10]')).toBeUndefined()
    })

    it('should handle null values in paths', () => {
      expect(deepGet(testData, 'user.address.street')).toBe(null)
      expect(deepGet(testData, 'user.settings.enabled')).toBeUndefined()
    })

    it('should handle non-existent paths', () => {
      expect(deepGet(testData, 'non.existent.path')).toBeUndefined()
      expect(deepGet(testData, 'user.non.existent')).toBeUndefined()
    })

    it('should handle empty paths', () => {
      expect(deepGet(testData, '')).toBeUndefined()
    })

    it('should handle very deep paths', () => {
      const deepData = {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: {
                    g: {
                      h: {
                        i: {
                          j: { k: { l: { m: { n: { o: { p: 'deep' } } } } } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
      expect(deepGet(deepData, 'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p')).toBe('deep')
    })

    it('should handle default values', () => {
      expect(deepGet(testData, 'non.existent', 'default')).toBe('default')
      expect(deepGet(testData, 'arr[10]', 'default')).toBe('default')
      expect(deepGet(testData, 'arr[-1]', 'default')).toBe('default')
    })
  })

  describe('splitDeepPath', () => {
    it('should handle simple object paths', () => {
      expect(splitDeepPath('user.name')).toEqual(['user', 'name'])
      expect(splitDeepPath('a.b.c')).toEqual(['a', 'b', 'c'])
    })

    it('should handle array indices', () => {
      expect(splitDeepPath('arr[0]')).toEqual(['arr', 0])
      expect(splitDeepPath('arr[1]')).toEqual(['arr', 1])
      expect(splitDeepPath('user.hobbies[2]')).toEqual(['user', 'hobbies', 2])
    })

    it('should handle mixed paths', () => {
      expect(splitDeepPath('user.hobbies[0].name')).toEqual([
        'user',
        'hobbies',
        0,
        'name',
      ])
      expect(splitDeepPath('data[0].items[1].value')).toEqual([
        'data',
        0,
        'items',
        1,
        'value',
      ])
    })

    it('should handle negative array indices', () => {
      // Отрицательные индексы должны быть отфильтрованы
      expect(splitDeepPath('arr[-1]')).toEqual(['arr'])
      expect(splitDeepPath('user.hobbies[-1]')).toEqual(['user', 'hobbies'])
    })

    it('should handle non-numeric array indices', () => {
      // Нечисловые индексы должны быть отфильтрованы
      expect(splitDeepPath('arr[abc]')).toEqual(['arr'])
      expect(splitDeepPath('user.hobbies[invalid]')).toEqual([
        'user',
        'hobbies',
      ])
    })

    it('should handle empty and invalid inputs', () => {
      expect(splitDeepPath('')).toEqual([])
      expect(splitDeepPath(null as any)).toEqual([])
      expect(splitDeepPath(undefined as any)).toEqual([])
    })

    it('should handle keys with dots', () => {
      expect(splitDeepPath('user.name.with.dots')).toEqual([
        'user',
        'name',
        'with',
        'dots',
      ])
    })

    it('should handle complex array paths', () => {
      expect(splitDeepPath('data[0][1][2]')).toEqual(['data', 0, 1, 2])
    })
  })
})
