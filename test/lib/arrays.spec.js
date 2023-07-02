import {arrayDifference, deduplicate} from "../../lib/index.js";


describe('lib/arrays', () => {
  it('deduplicate', () => {
    assert.deepEqual(deduplicate(['a', 'b', 'a', 'a']), ['a', 'b'])
    assert.deepEqual(deduplicate([1, 2, 1, 1]), [1, 2])
    assert.deepEqual(deduplicate([undefined, 2, 1, 1]), [undefined, 2, 1])
    assert.deepEqual(deduplicate([undefined, undefined, 1]), [undefined, 1])
    assert.deepEqual(deduplicate([null, null, 1]), [null, 1])
    assert.deepEqual(deduplicate([false, false, 1]), [false, 1])
    assert.deepEqual(deduplicate([0, 0, 1]), [0, 1])
    assert.deepEqual(deduplicate(['', '', 1]), ['', 1])

    // TODO: test arrays and objects
  })

  it.only('arrayDifference', () => {
    assert.deepEqual(arrayDifference([1, 2], [1, 5, 2]), [5])

    // TODO: как работает с инстансами классов?
    // TODO: как работает с массивами и объектами?
  })

})
