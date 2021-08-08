import { isEmptyObject } from './helper';

describe('Helper', () => {
  test.each([
    [{ a: 1 }, false],
    [null, false],
    [undefined, false],
    [{}, true],
  ])('isEmptyObject - check (%s, %s)', (input, output) => {
    expect(isEmptyObject(input)).toBe(output);
  });
});
