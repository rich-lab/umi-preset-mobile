import { getModeRecursion } from './';

test('getModeRecursion test', () => {
  expect(getModeRecursion([], 'flex')).toEqual(['flex']);

  expect(getModeRecursion([{ hdMode: 'vw' }], 'flex')).toEqual(['flex', 'vw']);

  expect(
    getModeRecursion(
      [
        { hdMode: 'vw' },
        {
          routes: [{ hdMode: 'flex' }],
        },
      ],
      'vw',
    ),
  ).toEqual(['vw', 'flex']);

  expect(
    getModeRecursion(
      [
        { hdMode: 'vw' },
        {
          hdMode: 'vv',
          routes: [
            {
              hdMode: 'vl',
              routes: [{ hdMode: 'flex' }],
            },
          ],
        },
      ],
      'vw',
    ),
  ).toEqual(['vw', 'flex']);
});
