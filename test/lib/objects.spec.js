import test from 'ava';
import * as objects from '../../lib/objects.js'


console.log(1111, objects)

test('foo', t => {
  t.pass();
});

test('bar', async t => {
  const bar = Promise.resolve('bar');
  t.is(await bar, 'bar');
});
