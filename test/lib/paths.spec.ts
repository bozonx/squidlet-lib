import { pathJoin } from '../../lib/index.js'

describe('lib/paths', () => {
  it('pathJoin', () => {
    expect(pathJoin('/', 'part1', 'part2', 'part3')).toBe('/part1/part2/part3')
    expect(pathJoin('part1', 'part2', 'part3')).toBe('part1/part2/part3')
    expect(pathJoin('part1', '/', 'part2')).toBe('part1//part2')
  })
})
