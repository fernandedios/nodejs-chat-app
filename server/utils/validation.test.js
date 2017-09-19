const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const boolean = isRealString(98);
    expect(boolean).toBe(false);
  });

  it('should reject string with only spaces', () => {
    const boolean = isRealString('  ');
    expect(boolean).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    const boolean = isRealString('Fernan');
    expect(boolean).toBe(true);
  });
});
