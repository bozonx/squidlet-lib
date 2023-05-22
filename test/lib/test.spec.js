import {
  getAllTheClassMembers,
  isEmptyObject,
  omitObj,
  omitUndefined,
  pickObj,
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
  })



})
