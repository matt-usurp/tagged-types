/**
 * Define a discriminator.
 */
export type Discriminator<Discriminator extends string, Value> = {
  /**
   * This is a discriminator field that can be used to test the value.
   * It is better to use the discriminator tooling provided instead.
   */
  readonly discriminator: Discriminator;
  readonly value: Value;
};

export namespace Discriminator {
  export type Constraint = Discriminator<string, unknown>;
}

export function factory<D extends Discriminator.Constraint>(discriminator: D['discriminator']) {
  return <V extends D['value']>(value: V): D => {
    return {
      discriminator,
      value,
    } as D;
  };
}

export function make<D extends Discriminator.Constraint>(discriminator: D['discriminator'], value: D['value']): D {
  return factory<D>(discriminator)(value);
}

export function assert<D extends Discriminator.Constraint>(discriminator: D['discriminator'], value: Discriminator.Constraint): value is D {
  return discriminator === value.discriminator;
}

export namespace Discriminator {
  export type Assertion<D extends Discriminator.Constraint> = (value: Discriminator.Constraint) => value is D;
}

export function is<D extends Discriminator.Constraint>(discriminator: D['discriminator']): Discriminator.Assertion<D> {
  return (value): value is D => {
    return assert(discriminator, value);
  };
}
