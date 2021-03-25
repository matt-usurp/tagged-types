/**
 * Define a discriminator.
 */
export type Discriminator<Discriminator extends string, Value> = {
  /**
   * This is a discriminator field that can be used to test the value.
   * It is better to use the discriminator tooling provided instead.
   */
  readonly type: Discriminator;
  readonly value: Value;
};

export namespace Discriminator {
  export type Constraint = Discriminator<string, unknown>;
}

export function factory<D extends Discriminator.Constraint>(discriminator: D['type']) {
  return <V extends D['value']>(value: V): D => {
    return {
      type: discriminator,
      value,
    } as D;
  };
}

export function make<D extends Discriminator.Constraint>(discriminator: D['type'], value: D['value']): D {
  return factory<D>(discriminator)(value);
}

export function assert<D extends Discriminator.Constraint>(discriminator: D['type'], value: Discriminator.Constraint): value is D {
  return discriminator === value.type;
}

export namespace Discriminator {
  export type Assertion<D extends Discriminator.Constraint> = (value: Discriminator.Constraint) => value is D;
}

export function is<D extends Discriminator.Constraint>(discriminator: D['type']): Discriminator.Assertion<D> {
  return (value): value is D => {
    return assert(discriminator, value);
  };
}
