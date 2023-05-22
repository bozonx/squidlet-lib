import * as objects from '../../distr/objects.js'
#TestModule = require('../../lib/objects.js')

describe 'system.lib.objects', ->
  it 'isEmptyObject', ->
    assert.isTrue(true)

#
#describe 'system.lib.objects', ->






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



#  it 'cloneDeepObject', ->
#    assert.deepEqual(objects.cloneDeepObject(), {})
#    assert.deepEqual(objects.cloneDeepObject({a: undefined}), {a: undefined})
#
#    obj = {a: 1}
#    assert.deepEqual(objects.cloneDeepObject(obj), {a: 1})
#    assert.isFalse(objects.cloneDeepObject(obj) == obj)
#
#    arr = [1]
#    objWithArr = {arr}
#    assert.deepEqual(objects.cloneDeepObject(objWithArr), {arr: [1]})
#    assert.isFalse(objects.cloneDeepObject(objWithArr).arr == arr)
#
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
