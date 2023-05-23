import {
  deepGet, deepSet,
} from '../../lib/deepManipulate.js'


describe('lib/deepManipulate', () => {
  it('deepGet', () => {
    assert.equal(deepGet({a1: {b1: 1}}, 'a1.b1'), 1)
    assert.deepEqual(deepGet({a1: {b1: 1}}, 'a1'), {b1: 1})
    assert.equal(deepGet({a1: {b1: ['c1']}}, 'a1.b1[0]'), 'c1')
    assert.strictEqual(deepGet({a1: {b1: [{c1: null}]}}, 'a1.b1[0].c1'), null)
    assert.strictEqual(deepGet({a1: 0}, 'a1'), 0)
    assert.strictEqual(deepGet({a1: ['']}, 'a1[0]'), '')
    // arrays
    assert.equal(deepGet([1, {a1: 1}], '[1].a1'), 1)
    assert.equal(deepGet([1, 2], '[1]'), 2)
    assert.equal(deepGet([[2]], '[0][0]'), 2)
    assert.equal(deepGet([1], '[2]', 3), 3)
    assert.equal(deepGet([1, {a1: 1}], '[2].a2', 3), 3)
    // not found
    assert.isUndefined(deepGet({a1: {b1: 1}}, 'a1.b2'))
    assert.isUndefined(deepGet({a1: {b1: ['c1']}}, 'a1.b1[2]'))
    assert.isUndefined(deepGet({a1: {b1: 1}}, 'a2'))
    // default value
    assert.equal(deepGet({a1: 5}, 'a2', 2), 2)
    assert.equal(deepGet({a1: {b1: ['c1']}}, 'a1.b1[2]', 3), 3)
    // wrong src
    assert.isUndefined(deepGet(null, 'a2'))
    assert.isUndefined(deepGet(undefined, 'a2'))
    assert.isUndefined(deepGet('', 'a2'))
    assert.isUndefined(deepGet([], 'a2'))
    assert.isUndefined(deepGet(5, 'a2'))
    // wrong path
    assert.isUndefined(deepGet({a1: {b1: 1}}))
  })

  it('deepSet', () => {
    let obj
    let arr
    // object
    obj = {a1: 2}
    deepSet(obj, 'a1', 2)
    assert.deepEqual(obj, {a1: 2})
    obj = {a1: {b2: 2}}
    deepSet(obj, 'a1.b2', null)
    assert.deepEqual(obj, {a1: {b2: null}})
    // add value to object
    obj = {a1: {b1: 1}}
    deepSet(obj, 'a2', {b3: 3})
    assert.deepEqual(obj, {a1: {b1: 1}, a2: {b3: 3}})
    obj = {a1: {b2: 2}}
    deepSet(obj, 'a1.b3', 3)
    assert.deepEqual(obj, {a1: {b2: 2, b3: 3}})
    // array
    arr = [1]
    deepSet(arr, '[0]', 2)
    assert.deepEqual(arr, [2])
    arr = [[2]]
    deepSet(arr, '[0][0]', 3)
    assert.deepEqual(arr, [[3]])
    arr = [{a1: [{b2: 1}]}]
    deepSet(arr, '[0].a1[0].b2', 3)
    assert.deepEqual(arr, [{a1: [{b2: 3}]}])
    arr = [[2]]
    deepSet(arr, '[0][1]', 3)
    assert.deepEqual(arr, [[2, 3]])
    // undefined
    obj = {a1: {b2: 2}}
    deepSet(obj, 'a1')
    assert.deepEqual(obj, {a1: undefined})
    arr = [[2]]
    deepSet(arr, '[0][0]')
    assert.deepEqual(arr, [[undefined]])
    // wrong data
    assert.doesNotThrow(() => deepSet(null, null, null))
    assert.doesNotThrow(() => deepSet(5, 5))

  })

})
