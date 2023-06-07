import {deduplicate} from "../../lib/index.js";


describe('lib/arrays', () => {
  it('deduplicate', () => {
    assert.deepEqual(deduplicate(['a', 'b', 'a', 'a']), ['a', 'b'])
    assert.deepEqual(deduplicate([1, 2, 1, 1]), [1, 2])
  })

})
