import { arrayDifference, deduplicate } from '../../lib/index.js'

describe('lib/arrays', () => {
  it('deduplicate', () => {
    expect(deduplicate(['a', 'b', 'a', 'a'])).toEqual(['a', 'b'])
    expect(deduplicate([1, 2, 1, 1])).toEqual([1, 2])
    expect(deduplicate([undefined, 2, 1, 1])).toEqual([undefined, 2, 1])
    expect(deduplicate([undefined, undefined, 1])).toEqual([undefined, 1])
    expect(deduplicate([null, null, 1])).toEqual([null, 1])
    expect(deduplicate([false, false, 1])).toEqual([false, 1])
    expect(deduplicate([0, 0, 1])).toEqual([0, 1])
    expect(deduplicate(['', '', 1])).toEqual(['', 1])

    // TODO: test arrays and objects
  })

  it('arrayDifference', () => {
    expect(arrayDifference([1, 2], [1, 5, 2])).toEqual([5])

    // TODO: как работает с инстансами классов?
    // TODO: как работает с массивами и объектами?
  })
})
