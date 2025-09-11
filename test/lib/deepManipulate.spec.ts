import {
  deepClone,
  deepDelete,
  deepFindObjAsync,
  deepGet,
  deepGetParent,
  deepHas,
  deepSet,
  joinDeepPath,
  splitDeepPath,
  deepFindObj,
  DONT_GO_DEEPER,
  deepEachObjAsync,
  deepEachObj,
  deepMerge,
  isSameDeep,
  deepGetObjValue,
} from '../../lib/index.js'

describe('lib/deepManipulate', () => {
  it('splitDeepPath', () => {
    expect(splitDeepPath('aa')).toEqual(['aa'])
    expect(splitDeepPath('aa.bb.cc')).toEqual(['aa', 'bb', 'cc'])
    expect(splitDeepPath('[0]')).toEqual([0])
    expect(splitDeepPath('[0][1]')).toEqual([0, 1])
    expect(splitDeepPath('aa[0]')).toEqual(['aa', 0])
    expect(splitDeepPath('aa[0].bb[1].cc')).toEqual(['aa', 0, 'bb', 1, 'cc'])
    // bad value
    expect(splitDeepPath('')).toEqual([])
    expect(splitDeepPath()).toEqual([])
    expect(splitDeepPath(8 as any)).toEqual([])
    expect(splitDeepPath(0 as any)).toEqual([])
    expect(splitDeepPath(false as any)).toEqual([])
    expect(splitDeepPath(true as any)).toEqual([])
    expect(splitDeepPath(null as any)).toEqual([])
    expect(splitDeepPath({} as any)).toEqual([])
    // Проблемные случаи (которые раньше вызывали ошибку)
    expect(splitDeepPath('user[].name')).toEqual(['user', 'name'])
    expect(splitDeepPath('user[abc].name')).toEqual(['user', 'name'])
    expect(splitDeepPath('user[.name')).toEqual(['user', 'name'])
    expect(splitDeepPath('user[0].name[')).toEqual(['user', 0, 'name'])
    expect(splitDeepPath('user[0].name[]')).toEqual(['user', 0, 'name'])
  })

  it('joinDeepPath', () => {
    expect(joinDeepPath([0, 'a', 1, 'b'])).toBe('[0].a[1].b')
    expect(joinDeepPath(['a', 1, 'b'])).toBe('a[1].b')
    expect(joinDeepPath(['a'])).toBe('a')
    expect(joinDeepPath([1])).toBe('[1]')
    expect(joinDeepPath([1, 2])).toBe('[1][2]')
    // join to already existent part
    expect(joinDeepPath(['aa.bb', 'cc'])).toBe('aa.bb.cc')
    expect(joinDeepPath(['aa.bb', 2])).toBe('aa.bb[2]')
    expect(joinDeepPath(['aa[1]', 2, 'bb'])).toBe('aa[1][2].bb')
    // undefined
    expect(joinDeepPath([undefined])).toBe('')
    expect(joinDeepPath([undefined, 'bb'])).toBe('bb')
    expect(joinDeepPath(['aa', undefined, 'bb'])).toBe('aa.bb')
    expect(joinDeepPath(['aa', undefined])).toBe('aa')
    expect(joinDeepPath([undefined, 2, 'bb'])).toBe('[2].bb')
    // bad value
    expect(joinDeepPath([])).toBe('')
    expect(joinDeepPath(undefined)).toBe('')
    expect(joinDeepPath(null as any)).toBe('')
    expect(joinDeepPath(5 as any)).toBe('')
    expect(joinDeepPath('g' as any)).toBe('')
    expect(joinDeepPath(false as any)).toBe('')
  })

  it('deepGet', () => {
    expect(deepGet({ a1: { b1: 1 } }, 'a1.b1')).toBe(1)
    expect(deepGet({ a1: { b1: 1 } }, 'a1')).toEqual({ b1: 1 })
    expect(deepGet({ a1: { b1: ['c1'] } }, 'a1.b1[0]')).toBe('c1')
    expect(deepGet({ a1: { b1: [{ c1: null }] } }, 'a1.b1[0].c1')).toBe(null)
    expect(deepGet({ a1: 0 }, 'a1')).toBe(0)
    expect(deepGet({ a1: [''] }, 'a1[0]')).toBe('')
    // arrays
    expect(deepGet([1, { a1: 1 }], '[1].a1')).toBe(1)
    expect(deepGet([1, 2], '[1]')).toBe(2)
    expect(deepGet([[2]], '[0][0]')).toBe(2)
    expect(deepGet([1], '[2]', 3)).toBe(3)
    expect(deepGet([1, { a1: 1 }], '[2].a2', 3)).toBe(3)
    // not found
    expect(deepGet({ a1: { b1: 1 } }, 'a1.b2')).toBeUndefined()
    expect(deepGet({ a1: { b1: ['c1'] } }, 'a1.b1[2]')).toBeUndefined()
    expect(deepGet({ a1: { b1: 1 } }, 'a2')).toBeUndefined()
    // default value
    expect(deepGet({ a1: 5 }, 'a2', 2)).toBe(2)
    expect(deepGet({ a1: { b1: ['c1'] } }, 'a1.b1[2]', 3)).toBe(3)
    // wrong src
    expect(deepGet(null as any, 'a2')).toBeUndefined()
    expect(deepGet(undefined, 'a2')).toBeUndefined()
    expect(deepGet('' as any, 'a2')).toBeUndefined()
    expect(deepGet([], 'a2')).toBeUndefined()
    expect(deepGet(5 as any, 'a2')).toBeUndefined()
    // wrong path
    expect(deepGet({ a1: { b1: 1 } })).toBeUndefined()
    // proxy array
    const proxyArr = new Proxy([{ a: 1 }], {
      get: (target, prop) => {
        return target[prop as unknown as number]
      },
    })
    expect(deepGet(proxyArr, '[0].a')).toBe(1)
    // proxy object
    const proxyObj = new Proxy(
      { a: { b: 1 } },
      {
        get: (target, prop) => {
          return target[prop as keyof typeof target]
        },
      }
    )
    expect(deepGet(proxyObj, 'a.b')).toBe(1)

    // Тесты для проверки обработки null значений
    const testObj = {
      user: {
        name: 'John',
        address: { city: 'New York', street: null },
        hobbies: ['reading', null, 'gaming'],
      },
      settings: null,
      items: [null, { id: 1 }, null],
    }

    // Проверка обработки null в пути
    expect(deepGet(testObj, 'user.address.street', 'default')).toBe(null)
    expect(deepGet(testObj, 'user.hobbies[1]', 'default')).toBe(null)
    expect(deepGet(testObj, 'settings.enabled', 'default')).toBe('default')
    expect(deepGet(testObj, 'items[0]', 'default')).toBe(null)
    expect(deepGet(testObj, 'items[2]', 'default')).toBe(null)

    // Проверка сложных случаев с null
    const complexObj = { level1: { level2: null, level3: { value: 'test' } } }
    expect(deepGet(complexObj, 'level1.level2.someProperty', 'default')).toBe(
      'default'
    )
    expect(deepGet(complexObj, 'level1.level3.value')).toBe('test')

    // Проверка массива с null элементами
    const arrayWithNulls = [
      { id: 1, data: 'test1' },
      null,
      { id: 2, data: 'test2' },
    ]
    expect(deepGet(arrayWithNulls, '[0].id')).toBe(1)
    expect(deepGet(arrayWithNulls, '[1].id', 'default')).toBe('default')
    expect(deepGet(arrayWithNulls, '[2].data')).toBe('test2')

    // Дополнительные тесты для других функций с null
    // deepGetParent
    expect(deepGetParent(null as any, 'user.name')).toEqual([])
    expect(deepGetParent(testObj, 'user.address.street')).toEqual([
      { city: 'New York', street: null },
      'street',
      'user.address',
    ])

    // deepHas
    expect(deepHas(null as any, 'user.name')).toBe(false)
    expect(deepHas(testObj, 'user.name')).toBe(true)
    expect(deepHas(testObj, 'user.address.street')).toBe(true)

    // deepSet
    expect(deepSet(null as any, 'user.name', 'value')).toBe(false)
    expect(deepSet(testObj, 'user.newField', 'value')).toBe(true)

    // deepDelete
    expect(deepDelete(null as any, 'user.name')).toBe(false)
    expect(deepDelete(testObj, 'user.name')).toBe(true)

    // deepClone
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
    const cloned = deepClone(testObj)
    expect(cloned).toEqual(testObj)

    // deepFindObj
    expect(deepFindObj(null as any, (obj) => true)).toBeUndefined()
    expect(
      deepFindObj(testObj, (obj, key) => key === 'nonexistent')
    ).toBeUndefined()

    // deepMerge
    expect(deepMerge(null, { a: 1 })).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, null)).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ b: 2, a: 1 })

    // isSameDeep
    expect(isSameDeep(null, null)).toBe(true)
    expect(isSameDeep(null, undefined)).toBe(false)
    expect(isSameDeep(null, { a: 1 })).toBe(false)
    expect(isSameDeep({ a: 1 }, { a: 1 })).toBe(true)

    // deepGetObjValue
    expect(deepGetObjValue(null as any, 'name')).toBeUndefined()
    expect(deepGetObjValue(testObj, 'nonexistent')).toBeUndefined()
  })

  it('deepGetParent', () => {
    expect(deepGetParent({ a: { b: { c: 1 } } }, 'a.b.c')).toEqual([
      { c: 1 },
      'c',
      'a.b',
    ])
    expect(deepGetParent({ a: [{ c: 1 }] }, 'a[0].c')).toEqual([
      { c: 1 },
      'c',
      'a[0]',
    ])
    expect(deepGetParent({ a: [{ c: 1 }] }, 'a[0]')).toEqual([
      [{ c: 1 }],
      0,
      'a',
    ])
    // wrong path - strict
    expect(deepGetParent({ a: { b: 1 } }, 'a.c', true)).toEqual([])
    expect(deepGetParent({ a: { b: 1 } }, 'a.c.a', true)).toEqual([])
    expect(deepGetParent({ a: [{ b: 1 }] }, 'a[1]', true)).toEqual([])
    // wrong path - not strict
    expect(deepGetParent({ a: { b: 1 } }, 'a.c')).toEqual([{ b: 1 }, 'c', 'a'])
    expect(deepGetParent({ a: { b: 1 } }, 'a.c.a')).toEqual([])
    expect(deepGetParent({ a: [{ b: 1 }] }, 'a[1]')).toEqual([
      [{ b: 1 }],
      1,
      'a',
    ])
  })

  it('deepHas', () => {
    expect(deepHas({ a1: { b1: 1 } }, 'a1.b1')).toBe(true)
    expect(deepHas({ a1: [{ b1: 1 }] }, 'a1[0].b1')).toBe(true)
    expect(deepHas({ a1: 1 }, 'a1')).toBe(true)
    expect(deepHas([0], '[0]')).toBe(true)
    expect(deepHas([[5]], '[0][0]')).toBe(true)
    // not found
    expect(deepHas({ a1: [{ b1: 1 }] }, 'a1[1].b1')).toBe(false)
    expect(deepHas({ a1: [{ b1: 1 }] }, 'a1[0].b2')).toBe(false)
    expect(deepHas({ a1: [0] }, 'a1[1]')).toBe(false)
    expect(deepHas([0], '[1]')).toBe(false)
    expect(deepHas([[5]], '[0][1]')).toBe(false)
    // bad values
    expect(deepHas(undefined, 'a')).toBe(false)
    expect(deepHas(null as any, 'a')).toBe(false)
    expect(deepHas('a' as any, 'a')).toBe(false)
    expect(deepHas(5 as any, 'a')).toBe(false)
    expect(deepHas(false as any, 'a')).toBe(false)
    expect(deepHas(false as any)).toBe(false)
    expect(deepHas(false as any, null as any)).toBe(false)
  })

  it('deepSet', () => {
    let obj: any
    let arr: any
    // object
    obj = { a1: 2 }
    expect(deepSet(obj, 'a1', 2)).toBe(true)
    expect(obj).toEqual({ a1: 2 })

    obj = { a1: { b2: 2 } }
    expect(deepSet(obj, 'a1.b2', null)).toBe(true)
    expect(obj).toEqual({ a1: { b2: null } })

    // add value to object
    obj = { a1: { b1: 1 } }
    expect(deepSet(obj, 'a2', { b3: 3 })).toBe(true)
    expect(obj).toEqual({ a1: { b1: 1 }, a2: { b3: 3 } })

    obj = { a1: { b2: 2 } }
    expect(deepSet(obj, 'a1.b3', 3)).toBe(true)
    expect(obj).toEqual({ a1: { b2: 2, b3: 3 } })

    // array
    arr = [1]
    expect(deepSet(arr, '[0]', 2)).toBe(true)
    expect(arr).toEqual([2])

    arr = [[2]]
    expect(deepSet(arr, '[0][0]', 3)).toBe(true)
    expect(arr).toEqual([[3]])

    arr = [{ a1: [{ b2: 1 }] }]
    expect(deepSet(arr, '[0].a1[0].b2', 3)).toBe(true)
    expect(arr).toEqual([{ a1: [{ b2: 3 }] }])

    arr = [[2]]
    expect(deepSet(arr, '[0][1]', 3)).toBe(true)
    expect(arr).toEqual([[2, 3]])

    // undefined
    obj = { a1: { b2: 2 } }
    expect(deepSet(obj, 'a1')).toBe(true)
    expect(obj).toEqual({ a1: undefined })

    arr = [[2]]
    expect(deepSet(arr, '[0][0]')).toBe(true)
    expect(arr).toEqual([[undefined]])

    // wrong data
    expect(() => deepSet(null as any, null as any, null)).not.toThrow()
    expect(() => deepSet(5 as any, 5 as any)).not.toThrow()
  })

  it('deepSet - set deep to empty object or array', () => {
    let obj: any
    let arr: any
    // object
    obj = {}
    expect(deepSet(obj, 'a.aa', 2)).toBe(true)
    expect(obj).toEqual({ a: { aa: 2 } })
    obj = {}
    expect(deepSet(obj, 'a[0].b', 2)).toBe(true)
    expect(obj).toEqual({ a: [{ b: 2 }] })
    obj = {}
    expect(deepSet(obj, 'a[0].b[1]')).toBe(true)
    expect(obj).toEqual({ a: [{ b: [undefined, undefined] }] })
    obj = {}
    expect(deepSet(obj, 'a')).toBe(true)
    expect(obj).toEqual({ a: undefined })
    // arr
    arr = []
    expect(deepSet(arr, '[0].a', 2)).toBe(true)
    expect(arr).toEqual([{ a: 2 }])
    arr = []
    expect(deepSet(arr, '[0][0].a', 2)).toBe(true)
    expect(arr).toEqual([[{ a: 2 }]])
    arr = []
    expect(deepSet(arr, '[0][1].a', 2)).toBe(true)
    expect(arr).toEqual([[undefined, { a: 2 }]])
    arr = []
    expect(deepSet(arr, '[0][1]', 2)).toBe(true)
    expect(arr).toEqual([[undefined, 2]])
  })

  it('deepDelete', () => {
    let obj: any
    let arr: any

    obj = { a: { b: { c: 1 } } }
    expect(deepDelete(obj, 'a.b.c')).toBe(true)
    expect(obj).toEqual({ a: { b: {} } })

    obj = { a: { b: { c: 1 } } }
    expect(deepDelete(obj, 'a.b')).toBe(true)
    expect(obj).toEqual({ a: {} })

    arr = [[2]]
    expect(deepDelete(arr, '[0][0]')).toBe(true)
    expect(arr).toEqual([[undefined]])

    arr = [[2]]
    expect(deepDelete(arr, '[0]')).toBe(true)
    expect(arr).toEqual([undefined])

    // wrong paths
    obj = { a: { b: { c: 1 } } }
    expect(deepDelete(obj, 'a.b.d')).toBe(false)
    expect(obj).toEqual({ a: { b: { c: 1 } } })

    obj = { a: { b: { c: 1 } } }
    expect(deepDelete(obj, 'b')).toBe(false)
    expect(obj).toEqual({ a: { b: { c: 1 } } })

    obj = { a: { b: { c: 1 } } }
    expect(deepDelete(obj, 'a.d.c')).toBe(false)
    expect(obj).toEqual({ a: { b: { c: 1 } } })

    arr = [[2]]
    expect(deepDelete(arr, '[0][1]')).toBe(false)
    expect(arr).toEqual([[2]])

    arr = [[2]]
    expect(deepDelete(arr, '[1][0]')).toBe(false)
    expect(arr).toEqual([[2]])
  })

  it('deepClone', () => {
    const obj = { a: [{ c: 1 }] }
    const clone = deepClone(obj)

    expect(clone).toEqual(obj)

    deepSet(clone, 'a[0].c', 2)

    expect(clone).not.toEqual(obj)
  })

  it('deepFindObj', () => {
    let count = 0

    expect(
      deepFindObj({ a: { b: { c: 1 } } }, (obj, key, path) => {
        if (key === 'a') {
          count++
          expect(path).toBe('a')
        } else if (key === 'b') {
          count++
          expect(path).toBe('a.b')

          return true
        }
      })
    ).toEqual({ c: 1 })
    expect(count).toBe(2)

    count = 0
    expect(
      deepFindObj([{ a: { b: 1 } }], (obj, key, path) => {
        if (key === 0) {
          count++
          expect(path).toBe('[0]')
        } else if (key === 'a') {
          count++
          expect(path).toBe('[0].a')

          return true
        }
      })
    ).toEqual({ b: 1 })
    expect(count).toBe(2)

    count = 0
    expect(
      deepFindObj([{ a: ['b'] }], (obj, key, path) => {
        if (key === 0) {
          count++
          expect(key).toBe(0)
          expect(path).toBe('[0]')

          return true
        }
      })
    ).toEqual({ a: ['b'] })
    expect(count).toBe(1)

    count = 0
    expect(
      deepFindObj({ a: { b: { c: 1 } }, a2: { b2: 1 } }, (obj, key, path) => {
        count++

        if (key === 'a') {
          return DONT_GO_DEEPER
        } else if (key === 'a2') {
          return true
        }
      })
    ).toEqual({ b2: 1 })
    expect(count).toBe(2)
  })

  it('deepFindObjAsync', async () => {
    let count = 0

    expect(
      await deepFindObjAsync({ a: { b: { c: 1 } } }, (obj, key, path) => {
        if (key === 'a') {
          count++
          expect(path).toBe('a')
        } else if (key === 'b') {
          count++
          expect(path).toBe('a.b')

          return true
        }
      })
    ).toEqual({ c: 1 })
    expect(count).toBe(2)

    count = 0
    expect(
      await deepFindObjAsync([{ a: { b: 1 } }], (obj, key, path) => {
        if (key === 0) {
          count++
          expect(path).toBe('[0]')
        } else if (key === 'a') {
          count++
          expect(path).toBe('[0].a')

          return true
        }
      })
    ).toEqual({ b: 1 })
    expect(count).toBe(2)

    count = 0
    expect(
      await deepFindObjAsync([{ a: ['b'] }], (obj, key, path) => {
        if (key === 0) {
          count++
          expect(key).toBe(0)
          expect(path).toBe('[0]')

          return true
        }
      })
    ).toEqual({ a: ['b'] })
    expect(count).toBe(1)

    count = 0
    expect(
      await deepFindObjAsync(
        { a: { b: { c: 1 } }, a2: { b2: 1 } },
        (obj, key, path) => {
          count++

          if (key === 'a') {
            return DONT_GO_DEEPER
          } else if (key === 'a2') {
            return true
          }
        }
      )
    ).toEqual({ b2: 1 })
    expect(count).toBe(2)
  })

  it('deepEachObj', () => {
    let count = 0
    expect(
      deepEachObj({ a: { b: { c: 1 } }, a2: { b2: 1 } }, (obj, key, path) => {
        count++

        if (key === 'a') {
          return DONT_GO_DEEPER
        } else if (key === 'a2') {
          return true
        }
      })
    ).toBeUndefined()
    expect(count).toBe(2)

    count = 0
    expect(
      deepEachObj([[{ a: 1 }]], (obj, key, path) => {
        count++

        expect(key).toBe(0)
        expect(path).toBe('[0][0]')
      })
    ).toBeUndefined()
    expect(count).toBe(1)
  })

  it('deepEachObjAsync', async () => {
    let count = 0

    expect(
      await deepEachObjAsync(
        { a: { b: { c: 1 } }, a2: { b2: 1 } },
        (obj, key, path) => {
          count++

          if (key === 'a') {
            return DONT_GO_DEEPER
          } else if (key === 'a2') {
            return true
          }
        }
      )
    ).toBeUndefined()
    expect(count).toBe(2)

    count = 0
    expect(
      await deepEachObjAsync([[{ a: 1 }]], (obj, key, path) => {
        count++

        expect(key).toBe(0)
        expect(path).toBe('[0][0]')
      })
    ).toBeUndefined()
    expect(count).toBe(1)
  })

  it('deepMerge', () => {
    // objects
    expect(
      deepMerge({ a1: { b1: 5 } }, { a1: { b1: 1, b2: 1 }, a2: 1 })
    ).toEqual({ a1: { b1: 5, b2: 1 }, a2: 1 })
    expect(
      deepMerge({ a1: { b1: { c1: 5 } } }, { a1: { b1: 1, b2: 1 }, a2: 1 })
    ).toEqual({ a1: { b1: { c1: 5 }, b2: 1 }, a2: 1 })
    expect(
      deepMerge(
        { a1: { b1: { c1: 5, c3: 5 } } },
        { a1: { b1: { c1: 1, c2: 1 } } }
      )
    ).toEqual({ a1: { b1: { c1: 5, c2: 1, c3: 5 } } })
    expect(deepMerge({ a: null }, { a: 1 })).toEqual({ a: 1 })
    // undefined in object
    expect(deepMerge({ a: undefined }, { a: 1 })).toEqual({ a: undefined })
    // arrays
    expect(deepMerge([], [5])).toEqual([5])
    expect(deepMerge([{ a1: [5] }], [{ a1: [1, 1], b2: 1 }])).toEqual([
      { a1: [5, 1], b2: 1 },
    ])
    expect(deepMerge([{ a1: [undefined, 5] }], [{ a1: [1, 1] }])).toEqual([
      { a1: [undefined, 5] },
    ])
    // mixed objects and arrays
    expect(deepMerge([{ a1: [{ b1: 5 }] }], [{ a1: [{ b1: [5] }] }])).toEqual([
      { a1: [{ b1: 5 }] },
    ])
    // simple values
    expect(deepMerge([], 5)).toEqual([])
    expect(deepMerge(5, [])).toBe(5)
    expect(deepMerge({}, 5)).toEqual({})
    expect(deepMerge(5, {})).toBe(5)
    expect(deepMerge(null, {})).toBe(null)
    expect(deepMerge('a', {})).toBe('a')
    // undefined
    expect(deepMerge(undefined, {})).toEqual({})
    expect(deepMerge(undefined, [])).toEqual([])
    expect(deepMerge(undefined, 5)).toBe(5)
    // class instances
    class Cl {
      cp = 1
    }
    let cli = new Cl()
    expect(deepMerge({ a: cli }, { a: { b: 1 } })).toEqual({ a: cli })
    expect(deepMerge({ a: { b: 1 } }, { a: cli })).toEqual({ a: { b: 1 } })
    expect(deepMerge([cli], [{ a: 1 }])).toEqual([cli])
    expect(deepMerge([{ a: 1 }], [cli])).toEqual([{ a: 1 }])
    // key order in object - bottom first
    expect(Object.keys(deepMerge({ c: 1, a: 1 }, { b: 1 }))).toEqual([
      'b',
      'c',
      'a',
    ])
  })

  it('isSameDeep', () => {
    // simple cases
    expect(isSameDeep({}, {})).toBe(true)
    expect(isSameDeep([], [])).toBe(true)
    expect(isSameDeep([1], [1])).toBe(true)
    expect(isSameDeep([1], [2])).toBe(false)
    expect(isSameDeep([1], [])).toBe(false)
    expect(isSameDeep([1], 1)).toBe(false)
    expect(isSameDeep([], 1)).toBe(false)
    expect(isSameDeep({}, 1)).toBe(false)
    expect(isSameDeep({})).toBe(false)
    expect(isSameDeep(undefined, {})).toBe(false)
    expect(isSameDeep([])).toBe(false)
    expect(isSameDeep(undefined, [])).toBe(false)
    expect(isSameDeep(undefined, undefined)).toBe(true)
    expect(isSameDeep(null, undefined)).toBe(false)
    expect(isSameDeep(null, null)).toBe(true)
    expect(isSameDeep(1, 1)).toBe(true)
    expect(isSameDeep(1, 0)).toBe(false)
    expect(isSameDeep(1, '1')).toBe(false)
    expect(isSameDeep(0, false)).toBe(false)
    expect(isSameDeep(false, false)).toBe(true)
    expect(isSameDeep('false', false)).toBe(false)
    expect(isSameDeep('', undefined)).toBe(false)
    expect(isSameDeep(0, undefined)).toBe(false)
    // NaN
    expect(isSameDeep(undefined, NaN)).toBe(false)
    expect(isSameDeep(0, NaN)).toBe(false)
    expect(isSameDeep(null, NaN)).toBe(false)
    expect(isSameDeep(NaN, NaN)).toBe(true)
    // in objects
    expect(isSameDeep({ a: 1 }, { a: 1 })).toBe(true)
    expect(isSameDeep({ a: 1 }, { b: 1 })).toBe(false)
    expect(isSameDeep({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(
      true
    )
    expect(isSameDeep({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(
      false
    )
    expect(isSameDeep({ a: { b: { c: 1 } } }, { a: { B: { c: 1 } } })).toBe(
      false
    )
    // in arrays
    expect(isSameDeep([[1]], [[1]])).toBe(true)
    expect(isSameDeep([[1]], [[2]])).toBe(false)
    expect(isSameDeep([[1]], [[1, 2]])).toBe(false)
    expect(isSameDeep([[1]], [undefined, [1]])).toBe(false)
    expect(isSameDeep([[undefined]], [[null]])).toBe(false)
    expect(isSameDeep([[undefined]], [[undefined]])).toBe(true)
    expect(isSameDeep([{ a: [1] }], [{ a: [1] }])).toBe(true)
    expect(isSameDeep([{ a: [1] }], [{ a: [2] }])).toBe(false)
    expect(isSameDeep([{ a: [1] }], [{ a: [1] }, undefined])).toBe(false)
    // class instances
    class Cl1 {}
    class Cl2 {}
    const cli1 = new Cl1()
    const cli2 = new Cl2()
    expect(isSameDeep(cli1, cli1)).toBe(true)
    expect(isSameDeep(cli1, Cl1)).toBe(false)
    expect(isSameDeep(cli1, cli2)).toBe(false)
    expect(isSameDeep({ a: cli1 }, { a: cli1 })).toBe(true)
    expect(isSameDeep({ a: cli1 }, { a: cli2 })).toBe(false)
    expect(isSameDeep([cli1], [cli1])).toBe(true)
    expect(isSameDeep([cli1], [cli2])).toBe(false)
  })

  it('deepGetObjValue', () => {
    expect(deepGetObjValue({ a: [{ $exp: 'g' }] }, '$exp')).toBe('g')
    // not found
    expect(deepGetObjValue({ a: [{ $exp: 'g' }] }, '$exp2')).toBeUndefined()
  })
})
