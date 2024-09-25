class AssertionError extends Error {}
class ExpectedError extends Error {}

export function equal(a, b) {
  if (a !== b) {
    throw new AssertionError(`Not equal: ${a}, ${b}`);
  }
}

/** @param {() => {}} */
export function doesNotThrow(fun) {
  try {
    fun();
  } catch (e) {
    throw new AssertionError('Should not throw.', { cause: e });
  }
}

/**
 * @param {() => {}} fun
 * @param {RegExp} [matcher]
 */
export function throws(fun, matcher) {
  try {
    fun();
    throw new ExpectedError();
  } catch (e) {
    if (e instanceof ExpectedError) {
      throw new AssertionError('Did not throw.');
    }
    if (matcher && !matcher.test(e.message)) {
      throw new AssertionError('Threw unexpected error.', { cause: e });
    }
  }
}
