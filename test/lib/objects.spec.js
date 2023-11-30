import {
  getAllTheClassMembers,
  isEmptyObject,
  omitObj,
  omitUndefined,
  pickObj,
  findObj,
  isPlainObject,
  getKeyOfObject,
  clearObject, getDeepMethod, getDeepPropValue,
} from '../../lib/objects.js'


describe('lib/objects', () => {
  it('getAllTheClassMembers', () => {
    class test {
      p = 0
      constructor() {
      }
      f() {}
    }
    const obj = new test()
    assert.deepEqual(getAllTheClassMembers(obj), ['p', 'f'])
    assert.deepEqual(getAllTheClassMembers(obj, ['p']), ['f'])
  })

  it('isEmptyObject - if not object then always true', () => {
    assert.isTrue(isEmptyObject({}))
    assert.isFalse(isEmptyObject({a:1}))
    // undefined means not empty!
    assert.isFalse(isEmptyObject({a: undefined}))
    // if not object then always true
    assert.isTrue(isEmptyObject(undefined))
    assert.isTrue(isEmptyObject(null))
    assert.isTrue(isEmptyObject(''))
    assert.isTrue(isEmptyObject([]))
    assert.isTrue(isEmptyObject(0))
    assert.isTrue(isEmptyObject('a'))
    assert.isTrue(isEmptyObject([1]))
    assert.isTrue(isEmptyObject(false))
  })

  it('omitObj', () => {
    assert.deepEqual(omitObj({a: 0, b: 1, c: 2}, 'a', 'b'), {c: 2})
    // if not undefined, null or other type then will return {}
    assert.deepEqual(omitObj(undefined, 'a', 'b'), {})
    assert.deepEqual(omitObj(null, 'a', 'b'), {})
    assert.deepEqual(omitObj([], 'a', 'b'), {})
    assert.deepEqual(omitObj('s', 'a', 'b'), {})
  })

  it('omitUndefined', () => {
    assert.deepEqual(omitUndefined({a: 0, b: undefined, c: 2}), {a: 0, c: 2})
    // if not undefined, null or other type then will return {}
    assert.deepEqual(omitUndefined(undefined), {})
    assert.deepEqual(omitUndefined(null), {})
    assert.deepEqual(omitUndefined([]), {})
    assert.deepEqual(omitUndefined(5), {})
  })

  it('pickObj', () => {
    assert.deepEqual(pickObj({a: 0, b: 1, c: 2}, 'b', 'c'), {b: 1, c: 2})
    // if not undefined, null or other type then will return {}
    assert.deepEqual(pickObj(undefined, 'b'), {})
    assert.deepEqual(pickObj(null, 'b'), {})
    assert.deepEqual(pickObj([], 'b'), {})
    assert.deepEqual(pickObj(5, 'b'), {})
  })

  it('findObj', () => {
    const objCb = (item, index) => item === 1
    assert.equal(findObj({a: 0, b: 1}, objCb), 1)
    assert.isUndefined(findObj({a: 0, b: 2}, objCb))
    // if not undefined or null then will return undefined
    assert.isUndefined(findObj(undefined, objCb))
    assert.isUndefined(findObj(null, objCb))
    // any other type - error
    assert.throws(() => findObj(5, objCb))
  })

  it('isPlainObject', () => {
    class cl {}
    assert.isTrue(isPlainObject({}))
    assert.isFalse(isPlainObject(new cl()))
    assert.isFalse(isPlainObject([]))
    assert.isFalse(isPlainObject(''))
    assert.isFalse(isPlainObject(undefined))
    assert.isFalse(isPlainObject(null))
    assert.isFalse(isPlainObject(0))
  })

  it('getKeyOfObject', () => {
    assert.isUndefined(getKeyOfObject({a:1}))
    assert.equal(getKeyOfObject({a: 1, b: 2}, 2), 'b')
    assert.isUndefined(getKeyOfObject({a: 1, b: 2}, 3))
    // it gets only the first key
    assert.equal(getKeyOfObject({a: 1, b: 1}, 1), 'a')
    // undefined, null and other types will return undfined
    assert.isUndefined(getKeyOfObject(undefined))
    assert.isUndefined(getKeyOfObject(null))
    assert.isUndefined(getKeyOfObject(5))
    assert.isUndefined(getKeyOfObject('s'))
    assert.isUndefined(getKeyOfObject([]))
  })

  it('clearObject', () => {
    const obj = {a:1}
    clearObject(obj)
    assert.deepEqual(obj, {})
    // undefined, null and other types will return undfined
    assert.doesNotThrow(() => clearObject(undefined))
    assert.doesNotThrow(() => clearObject(null))
    assert.doesNotThrow(() => clearObject(5))
    assert.doesNotThrow(() => clearObject('s'))
    assert.doesNotThrow(() => clearObject([]))
  })

  it('getDeepPropValue', () => {
    class Cls {
      prop = 1
    }
    const structure = {
      a: {
        b: new Cls()
      }
    }

    assert.equal(getDeepPropValue(structure, 'a.b.prop'), 1)
    // can't find
    assert.isUndefined(getDeepPropValue(structure, 'a.b.no-prop'))
    assert.isUndefined(getDeepPropValue('a', 'a.no-prop'))
    assert.equal(getDeepPropValue([0], 'length'), 1)
    assert.isUndefined(getDeepPropValue({a: 1}, 'no'))
    assert.isUndefined(getDeepPropValue({a: 1}, ''))
    assert.isUndefined(getDeepPropValue({a: 1}))
    assert.isUndefined(getDeepPropValue(undefined, 'a'))
  })

  it('getDeepMethod', () => {
    class Cls {
      prop = 1
      method() {
        return this.prop
      }
    }
    const structure = {
      a: {
        b: {
          c: new Cls()
        }
      }
    }

    assert.equal(getDeepMethod(structure, 'a.b.c.method')(), 1)
    assert.equal(getDeepMethod(structure.a.b.c, 'method')(), 1)
    assert.isUndefined(getDeepMethod(undefined, 'a.b.c.method'))
    assert.isUndefined(getDeepMethod('a', 'a.b.c.method'))
    assert.isUndefined(getDeepMethod([], 'a.b.c.method'))
    // can't find
    assert.isUndefined(getDeepMethod(structure, 'a.b.c.no-method'))
  })

})
