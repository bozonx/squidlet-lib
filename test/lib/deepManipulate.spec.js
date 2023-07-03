import {
  deepClone,
  deepDelete,
  deepFindObjAsync,
  deepGet, deepGetParent,
  deepHas,
  deepSet,
  joinDeepPath,
  splitDeepPath,
  deepFindObj, DONT_GO_DEEPER, deepEachObjAsync, deepEachObj, deepMerge, isSameDeep,
} from '../../lib/deepManipulate.js'


describe('lib/deepManipulate', () => {
  it('splitDeepPath', () => {
    assert.deepEqual(splitDeepPath('aa'), ['aa'])
    assert.deepEqual(splitDeepPath('aa.bb.cc'), ['aa', 'bb', 'cc'])
    assert.deepEqual(splitDeepPath('[0]'), [0])
    assert.deepEqual(splitDeepPath('[0][1]'), [0, 1])
    assert.deepEqual(splitDeepPath('aa[0]'), ['aa', 0])
    assert.deepEqual(splitDeepPath('aa[0].bb[1].cc'), ['aa', 0, 'bb', 1, 'cc'])
    // bad value
    assert.deepEqual(splitDeepPath(''), [])
    assert.deepEqual(splitDeepPath(), [])
    assert.deepEqual(splitDeepPath(8), [])
    assert.deepEqual(splitDeepPath(0), [])
    assert.deepEqual(splitDeepPath(false), [])
    assert.deepEqual(splitDeepPath(true), [])
    assert.deepEqual(splitDeepPath(null), [])
    assert.deepEqual(splitDeepPath({}), [])
  })

  it('joinDeepPath', () => {
    assert.equal(joinDeepPath([0, 'a', 1, 'b']), '[0].a[1].b')
    assert.equal(joinDeepPath(['a', 1, 'b']), 'a[1].b')
    assert.equal(joinDeepPath(['a']), 'a')
    assert.equal(joinDeepPath([1]), '[1]')
    assert.equal(joinDeepPath([1,2]), '[1][2]')
    // join to already existent part
    assert.equal(joinDeepPath(['aa.bb', 'cc']), 'aa.bb.cc')
    assert.equal(joinDeepPath(['aa.bb', 2]), 'aa.bb[2]')
    assert.equal(joinDeepPath(['aa[1]', 2, 'bb']), 'aa[1][2].bb')
    // undefined
    assert.equal(joinDeepPath([undefined]), '')
    assert.equal(joinDeepPath([undefined, 'bb']), 'bb')
    assert.equal(joinDeepPath(['aa', undefined, 'bb']), 'aa.bb')
    assert.equal(joinDeepPath(['aa', undefined]), 'aa')
    assert.equal(joinDeepPath([undefined, 2, 'bb']), '[2].bb')
    // bad value
    assert.equal(joinDeepPath([]), '')
    assert.equal(joinDeepPath(undefined), '')
    assert.equal(joinDeepPath(null), '')
    assert.equal(joinDeepPath(5), '')
    assert.equal(joinDeepPath('g'), '')
    assert.equal(joinDeepPath(false), '')
  })

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
    // proxy array
    const proxyArr = new Proxy([{a: 1}], {
      get: (target, prop) => {
        return target[prop]
      }
    })
    assert.equal(deepGet(proxyArr, '[0].a'), 1)
    // proxy object
    const proxyObj = new Proxy({a: {b: 1}}, {
      get: (target, prop) => {
        return target[prop]
      }
    })
    assert.equal(deepGet(proxyObj, 'a.b'), 1)
  })

  it('deepGetParent', () => {
    assert.deepEqual(
      deepGetParent({a: {b: {c: 1}}}, 'a.b.c'),
      [{c: 1}, 'c', 'a.b']
    )
    assert.deepEqual(
      deepGetParent({a: [{c: 1}]}, 'a[0].c'),
      [{c: 1}, 'c', 'a[0]']
    )
    assert.deepEqual(
      deepGetParent({a: [{c: 1}]}, 'a[0]'),
      [[{c: 1}], 0, 'a']
    )
    // wrong path - strict
    assert.deepEqual(deepGetParent({a: {b: 1}}, 'a.c', true), [])
    assert.deepEqual(deepGetParent({a: {b: 1}}, 'a.c.a', true), [])
    assert.deepEqual(deepGetParent({a: [{b: 1}]}, 'a[1]', true), [])
    // wrong path - not strict
    assert.deepEqual(deepGetParent({a: {b: 1}}, 'a.c'), [{b: 1}, 'c', 'a'])
    assert.deepEqual(deepGetParent({a: {b: 1}}, 'a.c.a'), [])
    assert.deepEqual(deepGetParent({a: [{b: 1}]}, 'a[1]'), [[{b: 1}], 1, 'a'])
  })

  it('deepHas', () => {
    assert.isTrue(deepHas({a1: {b1: 1}}, 'a1.b1'))
    assert.isTrue(deepHas({a1: [{b1: 1}]}, 'a1[0].b1'))
    assert.isTrue(deepHas({a1: 1}, 'a1'))
    assert.isTrue(deepHas([0], '[0]'))
    assert.isTrue(deepHas([[5]], '[0][0]'))
    // not found
    assert.isFalse(deepHas({a1: [{b1: 1}]}, 'a1[1].b1'))
    assert.isFalse(deepHas({a1: [{b1: 1}]}, 'a1[0].b2'))
    assert.isFalse(deepHas({a1: [0]}, 'a1[1]'))
    assert.isFalse(deepHas([0], '[1]'))
    assert.isFalse(deepHas([[5]], '[0][1]'))
    // bad values
    assert.isFalse(deepHas(undefined, 'a'))
    assert.isFalse(deepHas(null, 'a'))
    assert.isFalse(deepHas('a', 'a'))
    assert.isFalse(deepHas(5, 'a'))
    assert.isFalse(deepHas(false, 'a'))
    assert.isFalse(deepHas(false))
    assert.isFalse(deepHas(false, null))
  })

  it('deepSet', () => {
    let obj
    let arr
    // object
    obj = {a1: 2}
    assert.isTrue(deepSet(obj, 'a1', 2))
    assert.deepEqual(obj, {a1: 2})

    obj = {a1: {b2: 2}}
    assert.isTrue(deepSet(obj, 'a1.b2', null))
    assert.deepEqual(obj, {a1: {b2: null}})

    // add value to object
    obj = {a1: {b1: 1}}
    assert.isTrue(deepSet(obj, 'a2', {b3: 3}))
    assert.deepEqual(obj, {a1: {b1: 1}, a2: {b3: 3}})

    obj = {a1: {b2: 2}}
    assert.isTrue(deepSet(obj, 'a1.b3', 3))
    assert.deepEqual(obj, {a1: {b2: 2, b3: 3}})

    // array
    arr = [1]
    assert.isTrue(deepSet(arr, '[0]', 2))
    assert.deepEqual(arr, [2])

    arr = [[2]]
    assert.isTrue(deepSet(arr, '[0][0]', 3))
    assert.deepEqual(arr, [[3]])

    arr = [{a1: [{b2: 1}]}]
    assert.isTrue(deepSet(arr, '[0].a1[0].b2', 3))
    assert.deepEqual(arr, [{a1: [{b2: 3}]}])

    arr = [[2]]
    assert.isTrue(deepSet(arr, '[0][1]', 3))
    assert.deepEqual(arr, [[2, 3]])

    // undefined
    obj = {a1: {b2: 2}}
    assert.isTrue(deepSet(obj, 'a1'))
    assert.deepEqual(obj, {a1: undefined})

    arr = [[2]]
    assert.isTrue(deepSet(arr, '[0][0]'))
    assert.deepEqual(arr, [[undefined]])

    // wrong data
    assert.doesNotThrow(() => deepSet(null, null, null))
    assert.doesNotThrow(() => deepSet(5, 5))
  })

  it('deepSet - set deep to empty object or array', () => {
    let obj
    let arr
    // object
    obj = {}
    assert.isTrue(deepSet(obj, 'a.aa', 2))
    assert.deepEqual(obj, {a: {aa: 2}})
    obj = {}
    assert.isTrue(deepSet(obj, 'a[0].b', 2))
    assert.deepEqual(obj, {a: [{b: 2}]})
    obj = {}
    assert.isTrue(deepSet(obj, 'a[0].b[1]'))
    assert.deepEqual(obj, {a: [{b: [undefined, undefined]}]})
    obj = {}
    assert.isTrue(deepSet(obj, 'a'))
    assert.deepEqual(obj, {a: undefined})
    // arr
    arr = []
    assert.isTrue(deepSet(arr, '[0].a', 2))
    assert.deepEqual(arr, [{a: 2}])
    arr = []
    assert.isTrue(deepSet(arr, '[0][0].a', 2))
    assert.deepEqual(arr, [[{a: 2}]])
    arr = []
    assert.isTrue(deepSet(arr, '[0][1].a', 2))
    assert.deepEqual(arr, [[undefined, {a: 2}]])
    arr = []
    assert.isTrue(deepSet(arr, '[0][1]', 2))
    assert.deepEqual(arr, [[undefined, 2]])
  })

  it('deepDelete', () => {
    let obj
    let arr

    obj = {a: {b: {c: 1}}}
    assert.isTrue(deepDelete(obj, 'a.b.c'))
    assert.deepEqual(obj, {a: {b: {}}})

    obj = {a: {b: {c: 1}}}
    assert.isTrue(deepDelete(obj, 'a.b'))
    assert.deepEqual(obj, {a: {}})

    arr = [[2]]
    assert.isTrue(deepDelete(arr, '[0][0]'))
    assert.deepEqual(arr, [[undefined]])

    arr = [[2]]
    assert.isTrue(deepDelete(arr, '[0]'))
    assert.deepEqual(arr, [undefined])

    // wrong paths
    obj = {a: {b: {c: 1}}}
    assert.isFalse(deepDelete(obj, 'a.b.d'))
    assert.deepEqual(obj, {a: {b: {c: 1}}})

    obj = {a: {b: {c: 1}}}
    assert.isFalse(deepDelete(obj, 'b'))
    assert.deepEqual(obj, {a: {b: {c: 1}}})

    obj = {a: {b: {c: 1}}}
    assert.isFalse(deepDelete(obj, 'a.d.c'))
    assert.deepEqual(obj, {a: {b: {c: 1}}})

    arr = [[2]]
    assert.isFalse(deepDelete(arr, '[0][1]'))
    assert.deepEqual(arr, [[2]])

    arr = [[2]]
    assert.isFalse(deepDelete(arr, '[1][0]'))
    assert.deepEqual(arr, [[2]])
  })

  it('deepClone', () => {
    const obj = {a: [{c: 1}]}
    const clone = deepClone(obj)

    assert.deepEqual(clone, obj)

    deepSet(clone, 'a[0].c', 2)

    assert.notDeepEqual(clone, obj)
  })

  it('deepFindObj', () => {
    let count = 0

    assert.deepEqual(
      deepFindObj({a: {b: {c: 1}}}, (obj, key, path) => {
        if (key === 'a') {
          count++
          assert.equal(path, 'a')
        }
        else if (key === 'b') {
          count++
          assert.equal(path, 'a.b')

          return true
        }
      }),
      {c: 1}
    )
    assert.equal(count, 2)

    count = 0
    assert.deepEqual(
      deepFindObj([{a: {b: 1}}], (obj, key, path) => {
        if (key === 0) {
          count++
          assert.equal(path, '[0]')
        }
        else if (key === 'a') {
          count++
          assert.equal(path, '[0].a')

          return true
        }
      }),
      {b: 1}
    )
    assert.equal(count, 2)

    count = 0
    assert.deepEqual(
      deepFindObj([{a: ['b']}], (obj, key, path) => {
        if (key === 0) {
          count++
          assert.equal(key, 0)
          assert.equal(path, '[0]')

          return true
        }
      }),
      {a: ['b']}
    )
    assert.equal(count, 1)

    count = 0
    assert.deepEqual(
      deepFindObj({a: {b: {c: 1}}, a2: {b2: 1}}, (obj, key, path) => {
        count++

        if (key === 'a') {
          return DONT_GO_DEEPER
        }
        else if (key === 'a2') {
          return true
        }
      }),
      {b2: 1}
    )
    assert.equal(count, 2)
  })

  it('deepFindObjAsync', async () => {
    let count = 0

    assert.deepEqual(
      await deepFindObjAsync({a: {b: {c: 1}}}, (obj, key, path) => {
        if (key === 'a') {
          count++
          assert.equal(path, 'a')
        }
        else if (key === 'b') {
          count++
          assert.equal(path, 'a.b')

          return true
        }
      }),
      {c: 1}
    )
    assert.equal(count, 2)

    count = 0
    assert.deepEqual(
      await deepFindObjAsync([{a: {b: 1}}], (obj, key, path) => {
        if (key === 0) {
          count++
          assert.equal(path, '[0]')
        }
        else if (key === 'a') {
          count++
          assert.equal(path, '[0].a')

          return true
        }
      }),
      {b: 1}
    )
    assert.equal(count, 2)

    count = 0
    assert.deepEqual(
      await deepFindObjAsync([{a: ['b']}], (obj, key, path) => {
        if (key === 0) {
          count++
          assert.equal(key, 0)
          assert.equal(path, '[0]')

          return true
        }
      }),
      {a: ['b']}
    )
    assert.equal(count, 1)

    count = 0
    assert.deepEqual(
      await deepFindObjAsync({a: {b: {c: 1}}, a2: {b2: 1}}, (obj, key, path) => {
        count++

        if (key === 'a') {
          return DONT_GO_DEEPER
        }
        else if (key === 'a2') {
          return true
        }
      }),
      {b2: 1}
    )
    assert.equal(count, 2)
  })

  it('deepEachObj', () => {
    let count = 0
    assert.isUndefined(
      deepEachObj({a: {b: {c: 1}}, a2: {b2: 1}}, (obj, key, path) => {
        count++

        if (key === 'a') {
          return DONT_GO_DEEPER
        }
        else if (key === 'a2') {
          return true
        }
      })
    )
    assert.equal(count, 2)
  })

  it('deepEachObjAsync', async () => {
    let count = 0
    assert.isUndefined(
      await deepEachObjAsync({a: {b: {c: 1}}, a2: {b2: 1}}, (obj, key, path) => {
        count++

        if (key === 'a') {
          return DONT_GO_DEEPER
        }
        else if (key === 'a2') {
          return true
        }
      })
    )
    assert.equal(count, 2)
  })

  it('deepMerge', () => {
    // objects
    assert.deepEqual(
      deepMerge({a1: {b1: 5}}, {a1: {b1: 1, b2: 1}, a2: 1}),
      {a1: {b1: 5, b2: 1}, a2: 1}
    )
    assert.deepEqual(
      deepMerge({a1: {b1: {c1: 5}}}, {a1: {b1: 1, b2: 1}, a2: 1}),
      {a1: {b1: {c1: 5}, b2: 1}, a2: 1}
    )
    assert.deepEqual(
      deepMerge({a1: {b1: {c1: 5, c3: 5}}}, {a1: {b1: {c1: 1, c2: 1}}}),
      {a1: {b1: {c1: 5, c2: 1, c3: 5}}}
    )
    assert.deepEqual(deepMerge({a: null}, {a: 1}), {a: null})
    // undefined in object
    assert.deepEqual(deepMerge({a: undefined}, {a: 1}), {a: undefined})
    // arrays
    assert.deepEqual(deepMerge([], [5]), [5])
    assert.deepEqual(
      deepMerge([{a1: [5]}], [{a1: [1,1], b2: 1}]),
      [{a1: [5, 1], b2: 1}]
    )
    assert.deepEqual(
      deepMerge([{a1: [undefined, 5]}], [{a1: [1, 1]}]),
      [{a1: [undefined, 5]}]
    )
    // mixed objects and arrays
    assert.deepEqual(
      deepMerge([{a1: [{b1: 5}]}], [{a1: [{b1: [5]}]}]),
      [{a1: [{b1: 5}]}]
    )
    // simple values
    assert.deepEqual(deepMerge([], 5), [])
    assert.deepEqual(deepMerge(5, []), 5)
    assert.deepEqual(deepMerge({}, 5), {})
    assert.deepEqual(deepMerge(5, {}), 5)
    assert.deepEqual(deepMerge(null, {}), null)
    assert.deepEqual(deepMerge('a', {}), 'a')
    // undefined
    assert.deepEqual(deepMerge(undefined, {}), {})
    assert.deepEqual(deepMerge(undefined, []), [])
    assert.deepEqual(deepMerge(undefined, 5), 5)
    // class instances
    class cl {
      cp = 1
    }
    let cli = new cl()
    assert.deepEqual(deepMerge({a: cli}, {a: {b: 1}}), {a: cli})
    assert.deepEqual(deepMerge({a: {b: 1}}, {a: cli}), {a: {b: 1}})
    assert.deepEqual(deepMerge([cli], [{a: 1}]), [cli])
    assert.deepEqual(deepMerge([{a: 1}], [cli]), [{a: 1}])
    // key order in object - bottom first
    assert.deepEqual(
      Object.keys(deepMerge({c: 1, a: 1}, {b: 1})),
      ['b', 'c', 'a']
    )
  })

  it.only('isSameDeep', () => {
    // simple cases
    assert.isTrue(isSameDeep({}, {}))
    assert.isTrue(isSameDeep([], []))
    assert.isTrue(isSameDeep([1], [1]))
    assert.isFalse(isSameDeep([1], [2]))
    assert.isFalse(isSameDeep([1], []))
    assert.isFalse(isSameDeep([1], 1))
    assert.isFalse(isSameDeep([], 1))
    assert.isFalse(isSameDeep({}, 1))
    assert.isFalse(isSameDeep({}))
    assert.isFalse(isSameDeep(undefined, {}))
    assert.isFalse(isSameDeep([]))
    assert.isFalse(isSameDeep(undefined, []))
    assert.isTrue(isSameDeep(undefined, undefined))
    assert.isFalse(isSameDeep(null, undefined))
    assert.isTrue(isSameDeep(null, null))
    assert.isTrue(isSameDeep(1, 1))
    assert.isFalse(isSameDeep(1, 0))
    assert.isFalse(isSameDeep(1, '1'))
    assert.isFalse(isSameDeep(0, false))
    assert.isTrue(isSameDeep(false, false))
    assert.isFalse(isSameDeep('false', false))
    assert.isFalse(isSameDeep('', undefined))
    assert.isFalse(isSameDeep(0, undefined))
    // in objects
    assert.isTrue(isSameDeep({a: 1}, {a: 1}))
    assert.isFalse(isSameDeep({a: 1}, {b: 1}))
    // in arrays

    // deep

    // TODO: class instances
  })

})
