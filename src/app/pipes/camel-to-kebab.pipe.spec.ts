import { CamelToKebabPipe } from './camel-to-kebab.pipe';

describe('CamelToKebabPipe', () => {
  it('create an instance', () => {
    const pipe = new CamelToKebabPipe();
    expect(pipe).toBeTruthy();
  });
});
