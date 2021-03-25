import { assert, factory, is, make } from './discriminator';

describe('discriminator', (): void => {
  describe('factory()', (): void => {
    it('can create factory, factory returns discriminated value', (): void => {
      const discriminate = factory('test-discriminator-foo');
      const discriminated = discriminate({ foo: 123 });

      expect(discriminated).toEqual({
        discriminator: 'test-discriminator-foo',
        value: {
          foo: 123,
        },
      });
    });

    it('can create factory, factory can be used multiple times', (): void => {
      const discriminate = factory('test-discriminator-bar');

      expect(discriminate({ foo: 'foo-string' })).toEqual({
        discriminator: 'test-discriminator-bar',
        value: {
          foo: 'foo-string',
        },
      });

      expect(discriminate({ bar: 'bar-string' })).toEqual({
        discriminator: 'test-discriminator-bar',
        value: {
          bar: 'bar-string',
        },
      });

      expect(discriminate({ foo: 'foo-string', bar: 'bar-string' })).toEqual({
        discriminator: 'test-discriminator-bar',
        value: {
          foo: 'foo-string',
          bar: 'bar-string',
        },
      });
    });
  });

  describe('make()', (): void => {
    it('can make discriminated value', (): void => {
      const discriminated = make('test-discriminator-baz', { baz: 'baz-string' });

      expect(discriminated).toEqual({
        discriminator: 'test-discriminator-baz',
        value: {
          baz: 'baz-string',
        },
      });
    });
  });

  describe('assert()', (): void => {
    it('can detect discriminated value', (): void => {
      expect(
        assert('test-discriminator-alice', {
          discriminator: 'test-discriminator-alice',
          value: 123,
        })
      ).toEqual(true);
    });

    it('can detect invalid discriminated values', (): void => {
      expect(
        assert('test-discriminator-ashton', {
          discriminator: 'test-discriminator-alice',
          value: 123,
        })
      ).toEqual(false);
    });
  });

  describe('is()', (): void => {
    it('can detect discriminated value', (): void => {
      const discriminated = make('test-discriminator-jane', { jane: 'jane-string' });

      expect(is('test-discriminator-jane')(discriminated)).toEqual(true);
    });

    it('can detect discriminated value multiple times', (): void => {
      const asserter = is('test-discriminator-blake');

      expect(asserter(make('test-discriminator-blake', { blake: 'blake-string' }))).toEqual(true);
      expect(asserter(make('test-discriminator-blake', { brain: 'brain-string' }))).toEqual(true);
    });

    it('can detect invalid discriminator', (): void => {
      const asserter = is('test-discriminator-bruce');

      expect(asserter(make('test-discriminator-bruce', { bruce: 'bruce-string' }))).toEqual(true);
      expect(asserter(make('test-discriminator-blake', { blake: 'blake-string' }))).toEqual(false);
      expect(asserter(make('test-discriminator-blake', { brain: 'brain-string' }))).toEqual(false);
    });
  });
});
