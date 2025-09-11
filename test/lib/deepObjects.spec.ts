import {
  mergeDeepObjects,
  cloneDeepObject,
} from '../../lib/index.js'

describe('lib/deepObjects', () => {

  it('mergeDeepObjects', () => {
    const top = { top: 'top', nested: { nestedTop: 'top' } }
    const bottom = { top: 'bottom', bottom: 'bottom', nested: { nestedTop: 'bottom', nestedBottom: 'bottom' } }

    expect(mergeDeepObjects(top, bottom)).toEqual({
      top: 'top',
      bottom: 'bottom',
      nested: { nestedTop: 'top', nestedBottom: 'bottom' }
    })
    // not mutated
    expect(top).toEqual({ top: 'top', nested: { nestedTop: 'top' } })
    // set undefined obviously
    expect(mergeDeepObjects({ top: undefined }, { top: 'top', bottom: 'bottom' })).toEqual({
      bottom: 'bottom'
    })
    expect(mergeDeepObjects({ top: undefined, param: 1 })).toEqual({
      param: 1
    })
    expect(mergeDeepObjects(undefined, { bottom: undefined, param: 1 })).toEqual({
      bottom: undefined,
      param: 1
    })
  })

  it('mergeDeepObjects - clone arrays - not mutate', () => {
    const arr = [1]
    const top = { arr }
    const bottom = {}

    const result = mergeDeepObjects(top, bottom)

    expect(result).toEqual({ arr: [1] })
    expect(arr).not.toBe(result.arr)
  })

  it('cloneDeepObject', () => {
    expect(cloneDeepObject()).toEqual({})
    expect(cloneDeepObject({ a: undefined })).toEqual({ a: undefined })

    const obj = { a: 1 }
    expect(cloneDeepObject(obj)).toEqual({ a: 1 })
    expect(cloneDeepObject(obj)).not.toBe(obj)

    const arr = [1]
    const objWithArr = { arr }
    expect(cloneDeepObject(objWithArr)).toEqual({ arr: [1] })
    expect(cloneDeepObject(objWithArr).arr).not.toBe(arr)
  })
})
