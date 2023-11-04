import {
  pathJoin,
} from '../../lib/paths.js'


describe('lib/paths', () => {
  it('pathJoin', () => {
    assert.deepEqual(pathJoin('/', 'part1', 'part2', 'part3'), '/part1/part2/part3')
    assert.deepEqual(pathJoin('part1', 'part2', 'part3'), 'part1/part2/part3')
    assert.deepEqual(pathJoin('part1', '/', 'part2'), 'part1//part2')
  })

})
