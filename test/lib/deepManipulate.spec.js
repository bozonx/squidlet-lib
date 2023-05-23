import {
  deepGet,
} from '../../lib/deepManipulate.js'


describe('lib/deepManipulate', () => {

  it('mergeDeepObjects', () => {
    assert.equal(deepGet({a1: {b1: 1}}, 'a1.b1'), 1)
    assert.deepEqual(deepGet({a1: {b1: 1}}, 'a1'), {b1: 1})
    assert.equal(deepGet({a1: {b1: ['c1']}}, 'a1.b1[0]'), 'c1')
    // not found
    assert.isUndefined(deepGet({a1: {b1: 1}}, 'a1.b2'))
    assert.isUndefined(deepGet({a1: {b1: ['c1']}}, 'a1.b1[2]'))
    assert.isUndefined(deepGet({a1: {b1: 1}}, 'a2'))
  })

})
