import {
  getAllTheClassMembers,
  isEmptyObject,
  omitObj,
  omitUndefined,
  pickObj,
  findObj,
  isPlainObject,
  getKeyOfObject,
  clearObject,
  getDeepMethod,
  getDeepPropValue,
} from '../../lib/index.js'

describe('lib/objects', () => {
  it('getAllTheClassMembers', () => {
    class Test {
      p = 0
      constructor() {
        // конструктор
      }
      f() {
        // метод
      }
    }
    const obj = new Test()
    expect(getAllTheClassMembers(obj)).toEqual(['p', 'f'])
    expect(getAllTheClassMembers(obj, ['p'])).toEqual(['f'])
  })

  it('isEmptyObject - if not object then always true', () => {
    expect(isEmptyObject({})).toBe(true)
    expect(isEmptyObject({ a: 1 })).toBe(false)
    // undefined means not empty!
    expect(isEmptyObject({ a: undefined })).toBe(false)
    // if not object then always true
    expect(isEmptyObject(undefined)).toBe(true)
    expect(isEmptyObject(null)).toBe(true)
    expect(isEmptyObject('' as any)).toBe(true)
    expect(isEmptyObject([])).toBe(true)
    expect(isEmptyObject(0 as any)).toBe(true)
    expect(isEmptyObject('a' as any)).toBe(true)
    expect(isEmptyObject([1])).toBe(true)
    expect(isEmptyObject(false as any)).toBe(true)
  })

  it('omitObj', () => {
    expect(omitObj({ a: 0, b: 1, c: 2 }, 'a', 'b')).toEqual({ c: 2 })
    // if not undefined, null or other type then will return {}
    expect(omitObj(undefined, 'a', 'b')).toEqual({})
    expect(omitObj(null, 'a', 'b')).toEqual({})
    expect(omitObj([], 'a', 'b')).toEqual({})
    expect(omitObj('s' as any, 'a', 'b')).toEqual({})
  })

  it('omitUndefined', () => {
    expect(omitUndefined({ a: 0, b: undefined, c: 2 })).toEqual({ a: 0, c: 2 })
    // if not undefined, null or other type then will return {}
    expect(omitUndefined(undefined)).toEqual({})
    expect(omitUndefined(null)).toEqual({})
    expect(omitUndefined([])).toEqual({})
    expect(omitUndefined(5 as any)).toEqual({})
  })

  it('pickObj', () => {
    expect(pickObj({ a: 0, b: 1, c: 2 }, 'b', 'c')).toEqual({ b: 1, c: 2 })
    // if not undefined, null or other type then will return {}
    expect(pickObj(undefined, 'b')).toEqual({})
    expect(pickObj(null, 'b')).toEqual({})
    expect(pickObj([], 'b')).toEqual({})
    expect(pickObj(5 as any, 'b')).toEqual({})
  })

  it('findObj', () => {
    const objCb = (item: any, index: any) => item === 1
    expect(findObj({ a: 0, b: 1 }, objCb)).toBe(1)
    expect(findObj({ a: 0, b: 2 }, objCb)).toBeUndefined()
    // if not undefined or null then will return undefined
    expect(findObj(undefined, objCb)).toBeUndefined()
    expect(findObj(null, objCb)).toBeUndefined()
    // any other type - error
    expect(() => findObj(5 as any, objCb)).toThrow()
  })

  it('isPlainObject', () => {
    class Cl {}
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject(new Cl())).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject('')).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(0)).toBe(false)
  })

  it('getKeyOfObject', () => {
    expect(getKeyOfObject({ a: 1 })).toBeUndefined()
    expect(getKeyOfObject({ a: 1, b: 2 }, 2)).toBe('b')
    expect(getKeyOfObject({ a: 1, b: 2 }, 3)).toBeUndefined()
    // it gets only the first key
    expect(getKeyOfObject({ a: 1, b: 1 }, 1)).toBe('a')
    // undefined, null and other types will return undefined
    expect(getKeyOfObject(undefined)).toBeUndefined()
    expect(getKeyOfObject(null as any)).toBeUndefined()
    expect(getKeyOfObject(5 as any)).toBeUndefined()
    expect(getKeyOfObject('s' as any)).toBeUndefined()
    expect(getKeyOfObject([])).toBeUndefined()
  })

  it('clearObject', () => {
    const obj = { a: 1 }
    clearObject(obj)
    expect(obj).toEqual({})
    // undefined, null and other types will return undefined
    expect(() => clearObject(undefined as any)).not.toThrow()
    expect(() => clearObject(null as any)).not.toThrow()
    expect(() => clearObject(5 as any)).not.toThrow()
    expect(() => clearObject('s' as any)).not.toThrow()
    expect(() => clearObject([] as any)).not.toThrow()
  })

  it('getDeepPropValue', () => {
    class Cls {
      prop = 1
    }
    const structure = { a: { b: new Cls() } }

    expect(getDeepPropValue(structure, 'a.b.prop')).toBe(1)
    // can't find
    expect(getDeepPropValue(structure, 'a.b.no-prop')).toBeUndefined()
    expect(getDeepPropValue('a', 'a.no-prop')).toBeUndefined()
    expect(getDeepPropValue([0], 'length')).toBe(1)
    expect(getDeepPropValue({ a: 1 }, 'no')).toBeUndefined()
    expect(getDeepPropValue({ a: 1 }, '')).toBeUndefined()
    expect(getDeepPropValue({ a: 1 }, '')).toBeUndefined()
    expect(getDeepPropValue(undefined, 'a')).toBeUndefined()
  })

  it('getDeepMethod', () => {
    class Cls {
      prop = 1
      method() {
        return this.prop
      }
    }
    const structure = { a: { b: { c: new Cls() } } }

    expect(getDeepMethod(structure, 'a.b.c.method')!()).toBe(1)
    expect(getDeepMethod(structure.a.b.c, 'method')!()).toBe(1)
    expect(getDeepMethod(undefined, 'a.b.c.method')).toBeUndefined()
    expect(getDeepMethod('a', 'a.b.c.method')).toBeUndefined()
    expect(getDeepMethod([], 'a.b.c.method')).toBeUndefined()
    // can't find
    expect(getDeepMethod(structure, 'a.b.c.no-method')).toBeUndefined()
  })
})
