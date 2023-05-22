import {
  mergeDeepObjects,
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

})
