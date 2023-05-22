import {
  mergeDeepObjects,
  cloneDeepObject,
} from '../../lib/deepObjects.js'


describe('lib/deepObjects', () => {

  it('mergeDeepObjects', () => {
    const top = {top: 'top', nested: {nestedTop: 'top'}}
    const bottom = {top: 'bottom', bottom: 'bottom', nested: {nestedTop: 'bottom', nestedBottom: 'bottom'}}

    assert.deepEqual(
      mergeDeepObjects(top, bottom),
      {top: 'top', bottom: 'bottom', nested: {nestedTop: 'top', nestedBottom: 'bottom'}}
    )
    // not mutated
    assert.deepEqual(top, {top: 'top', nested: {nestedTop: 'top'}})
    // set undefined obviously
    assert.deepEqual(
      mergeDeepObjects({top: undefined}, {top: 'top', bottom: 'bottom'}),
      {bottom: 'bottom'}
    )
    assert.deepEqual(
      mergeDeepObjects({top: undefined, param: 1}),
      {param: 1}
    )
    assert.deepEqual(
      mergeDeepObjects(undefined , {bottom: undefined, param: 1}),
      {bottom: undefined, param: 1}
    )
  })

  it('mergeDeepObjects - clone arrays - not mutate', () => {
    const arr = [1]
    const top = {arr}
    const bottom = {}

    const result = mergeDeepObjects(top, bottom)

    assert.deepEqual(result, {arr: [1]})
    assert.isFalse(arr == result.arr)
  })

  it('cloneDeepObject', () => {
    assert.deepEqual(cloneDeepObject(), {})
    assert.deepEqual(cloneDeepObject({a: undefined}), {a: undefined})

    const obj = {a: 1}
    assert.deepEqual(cloneDeepObject(obj), {a: 1})
    assert.isFalse(cloneDeepObject(obj) == obj)

    const arr = [1]
    const objWithArr = {arr}
    assert.deepEqual(cloneDeepObject(objWithArr), {arr: [1]})
    assert.isFalse(cloneDeepObject(objWithArr).arr == arr)
  })

})


/*
#  it 'objGet', ->
#    obj = {
#      level1: {
#        level2: {
#          level3: 1
#        }
#      }
#    }
#
#    assert.equal(objects.objGet(obj, 'level1.level2.level3'), obj.level1.level2.level3)
#    assert.deepEqual(objects.objGet(obj, 'level1.level2'), obj.level1.level2)
#    assert.deepEqual(objects.objGet(obj, 'level1'), obj.level1)
#    assert.isUndefined(objects.objGet(obj, 'level1.level2.unknown'))
#    assert.equal(objects.objGet(obj, 'level1.level2.unknown', 'default'), 'default')
#    assert.equal(objects.objGet(obj, '', 'default'), 'default')
#    # arrays - aren't supported
#    assert.isUndefined(objects.objGet(obj, 'level1[1]'))
#    assert.deepEqual(objects.objGet({a: [1]}, 'a'), [1])
#    assert.isUndefined(objects.objGet({a: [1]}, 'a.b'))




##  it 'getDifferentKeys', ->
##    assert.deepEqual(objects.getDifferentKeys({a:1, b:1, c:1}, {a:1, b:2}), ['b'])
##    assert.deepEqual(objects.getDifferentKeys(undefined, {a:1, b:2}), ['a', 'b'])
##    assert.deepEqual(objects.getDifferentKeys({a:1, b:1, c:1}, undefined), [])
#
##  it 'isExactlyObject', ->
##    cl = () ->
##    assert.isTrue(objects.isExactlyObject({}))
##    assert.isTrue(objects.isExactlyObject(new cl()))
##    assert.isFalse(objects.isExactlyObject([]))
##    assert.isFalse(objects.isExactlyObject(''))
##    assert.isFalse(objects.isExactlyObject(undefined))
##    assert.isFalse(objects.isExactlyObject(null))
##    assert.isFalse(objects.isExactlyObject(0))

 */
