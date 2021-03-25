import { Discriminator, is, make } from '../src/discriminator';

/**
 * Below is an example of a "reader result" implementation.
 * Idea being a "read()" function will return this, and it indicates a success or failure.
 */

/**
 * Enum is used as the source of truth in the pivot.
 * These values are used with discrimination testing.
 */
enum ReaderResultType {
  Success = 'Reader:Success',
  Failure = 'Reader:Failure',
}

type ReaderResultData<T> = { bytes: number; value: T; };
type ReaderResultError<T> = { error: T; };

/**
 * The most important part of the discriminator pattern is here.
 * A single type that can be either of two (or more) types.
 * In this case we have the concept of a "success" or "failure".
 */
type ReaderResult<T, E> = (
  | ReaderResult.Success<T>
  | ReaderResult.Failure<E>
);

namespace ReaderResult {
  export type Success<T> = Discriminator<ReaderResultType.Success, ReaderResultData<T>>;
  export type Failure<T> = Discriminator<ReaderResultType.Failure, ReaderResultError<T>>;
}

/**
 * Below we can make some utilities that will help in our code.
 * These all wrap the existing utilities supplied by the library.
 */

export function createReaderSuccess<V>(value: ReaderResultData<V>): ReaderResult.Success<V> {
  return make<ReaderResult.Success<V>>(ReaderResultType.Success, value);
}

export function createReaderFailure<V>(value: ReaderResultError<V>): ReaderResult.Failure<V> {
  return make<ReaderResult.Failure<V>>(ReaderResultType.Failure, value);
}

export const isReaderSuccess = is<ReaderResult.Success<unknown>>(ReaderResultType.Success);
export const isReaderFailure = is<ReaderResult.Failure<unknown>>(ReaderResultType.Failure);

/**
 * Usages look as follows:
 */

type SomethingExpected = { foo: string; };
type SomethingWrong = { message: string; };

const reader = (): ReaderResult<SomethingExpected, SomethingWrong> => {
  if (Math.random() < 0.5) {
    return createReaderFailure<SomethingWrong>({
      error: {
        message: 'Bad luck!',
      },
    });
  }

  return createReaderSuccess<SomethingExpected>({
    bytes: 100,
    value: {
      foo: 'bar',
    },
  });
};

// At this point we don't know what the result is going to be.
// Its either a success or failure, we can test it with our is() functions.
const result = reader();

if (isReaderSuccess(result)) {
  result.value.bytes; // 100
}

if (isReaderFailure(result)) {
  result.value.error.message; // Bad luck!
}

// A failure could be many kinds of failure, in this case we define one.
// But there is nothing stopping you from nesting discriminators.
