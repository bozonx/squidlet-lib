import { normalizeArgs, parseArgs } from '../../lib/index.js'

describe('lib/argv', () => {
  it('parseArgs - = style', () => {
    // = style
    expect(parseArgs(['--param1=v', 'command', '-p1=2', '-p2=true'])).toEqual({
      params: {
        param1: 'v',
        p1: 2,
        p2: true,
      },
      args: ['command']
    })
    // space style
    expect(parseArgs(['--param1 v', 'command', '-p1 2', '-p2 true'])).toEqual({
      params: {
        param1: 'v',
        p1: 2,
        p2: true,
      },
      args: ['command']
    })
    // process.argv style
    expect(parseArgs(['--param1 ', ' v', 'command', '-p1 ', ' 2', '-p2 ', ' true'])).toEqual({
      params: {
        param1: 'v',
        p1: 2,
        p2: true,
      },
      args: ['command']
    })
    // mixed style
    expect(parseArgs(['--param1 ', ' v', '--bool', 'command', '-p1=2', '-p2   true', '--', ' ./path '], ['bool'])).toEqual({
      params: {
        param1: 'v',
        bool: true,
        p1: 2,
        p2: true,
      },
      args: ['command', './path']
    })
  })

  it('normalizeArgs', () => {
    // = style
    expect(normalizeArgs([' --param1= v ', ' -p1=v ', ' command '])).toEqual(['--param1=v', '-p1=v', 'command'])
    // space style
    expect(normalizeArgs([' --param1    v ', ' -p1 v ', ' command '])).toEqual(['--param1 v', '-p1 v', 'command'])
    // boolean
    expect(normalizeArgs(
      [' --param1    v ', ' -b ', ' --b2  ', ' command '],
      ['b', 'b2']
    )).toEqual(['--param1 v', '-b', '--b2', 'command'])
    // sort numeric args
    expect(normalizeArgs([' --param1    v ', ' command ', ' -b=v '])).toEqual(['--param1 v', '-b=v', 'command'])
    // -- delimiter at the end
    expect(normalizeArgs([' --param1    v ', '  -- '])).toEqual(['--param1 v'])
    // -- delimiter
    expect(normalizeArgs([' --param1    v ', '  -- ', ' command ', ' -b=v '])).toEqual(['--param1 v', 'command', '-b=v'])
    // process.argv style
    expect(normalizeArgs([' --param1 ', ' v ', ' command ', ' -p1 ', ' -p2 '])).toEqual(['--param1 v', '-p1', '-p2', 'command'])
    // process.argv style. boolean before --
    expect(normalizeArgs([' --param1 ', ' -- ', ' command '])).toEqual(['--param1', 'command'])
  })
})
