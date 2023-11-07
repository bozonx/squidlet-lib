import {normalizeArgs, parseArgs} from "../../lib/index.js";


describe('lib/argv', () => {
  it('parseArgs - = style', () => {
    // = style
    assert.deepEqual(
      parseArgs(['--param1=v', 'command', '-p1=2', '-p2=true']),
      {
        params: {
          param1: 'v',
          p1: 2,
          p2: true,
        },
        args: ['command']
      }
    )
    // space style
    assert.deepEqual(
      parseArgs(['--param1 v', 'command', '-p1 2', '-p2 true']),
      {
        params: {
          param1: 'v',
          p1: 2,
          p2: true,
        },
        args: ['command']
      }
    )
    // process.argv style
    assert.deepEqual(
      parseArgs(['--param1 ', ' v', 'command', '-p1 ', ' 2', '-p2 ', ' true']),
      {
        params: {
          param1: 'v',
          p1: 2,
          p2: true,
        },
        args: ['command']
      }
    )
    // mixed style
    assert.deepEqual(
      parseArgs(['--param1 ', ' v', '--bool', 'command', '-p1=2', '-p2   true', '--', ' ./path '], ['bool']),
      {
        params: {
          param1: 'v',
          bool: true,
          p1: 2,
          p2: true,
        },
        args: ['command', './path']
      }
    )
  })

  it('normalizeArgs', () => {
    // = style
    assert.deepEqual(
      normalizeArgs([' --param1= v ', ' -p1=v ', ' command ']),
      ['--param1=v', '-p1=v', 'command']
    )
    // space style
    assert.deepEqual(
      normalizeArgs([' --param1    v ', ' -p1 v ', ' command ']),
      ['--param1 v', '-p1 v', 'command']
    )
    // boolean
    assert.deepEqual(
      normalizeArgs(
        [' --param1    v ', ' -b ', ' --b2  ', ' command '],
        ['b', 'b2']
      ),
      ['--param1 v', '-b', '--b2', 'command']
    )
    // sort numeric args
    assert.deepEqual(
      normalizeArgs([' --param1    v ', ' command ', ' -b=v ']),
      ['--param1 v', '-b=v', 'command']
    )
    // -- delimiter at the end
    assert.deepEqual(
      normalizeArgs([' --param1    v ', '  -- ']),
      ['--param1 v']
    )
    // -- delimiter
    assert.deepEqual(
      normalizeArgs([' --param1    v ', '  -- ', ' command ', ' -b=v ']),
      ['--param1 v', 'command', '-b=v']
    )
    // process.argv style
    assert.deepEqual(
      normalizeArgs([' --param1 ', ' v ', ' command ', ' -p1 ', ' -p2 ']),
      ['--param1 v', '-p1', '-p2', 'command']
    )
  })

})
