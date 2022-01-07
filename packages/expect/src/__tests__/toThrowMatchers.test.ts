/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {alignedAnsiStyleSerializer} from '@elric/test-utils';
import elricExpect from '../';

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

// Custom Error class because node versions have different stack trace strings.
class CustomError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'Error';
    this.stack =
      'Error\n' +
      '  at elricExpect' +
      ' (packages/expect/src/__tests__/toThrowMatchers-test.js:24:74)';
  }
}

// `as const` needs newer babel which explodes on node 6
const matchers: ['toThrowError', 'toThrow'] = ['toThrowError', 'toThrow'];

matchers.forEach(toThrow => {
  describe(toThrow, () => {
    class Err extends CustomError {}
    class Err2 extends CustomError {}

    test('to throw or not to throw', () => {
      elricExpect(() => {
        throw new CustomError('apple');
      })[toThrow]();
      elricExpect(() => {}).not[toThrow]();
    });

    describe('substring', () => {
      it('passes', () => {
        elricExpect(() => {
          throw new CustomError('apple');
        })[toThrow]('apple');
        elricExpect(() => {
          throw new CustomError('banana');
        }).not[toThrow]('apple');
        elricExpect(() => {}).not[toThrow]('apple');
      });

      test('did not throw at all', () => {
        expect(() =>
          elricExpect(() => {})[toThrow]('apple'),
        ).toThrowErrorMatchingSnapshot();
      });

      test('threw, but message did not match (error)', () => {
        expect(() => {
          elricExpect(() => {
            throw new CustomError('apple');
          })[toThrow]('banana');
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but message did not match (non-error falsey)', () => {
        expect(() => {
          elricExpect(() => {
            // eslint-disable-next-line no-throw-literal
            throw '';
          })[toThrow]('Server Error');
        }).toThrowErrorMatchingSnapshot();
      });

      it('properly escapes strings when matching against errors', () => {
        elricExpect(() => {
          throw new TypeError('"this"? throws.');
        })[toThrow]('"this"? throws.');
      });

      test('threw, but message should not match (error)', () => {
        expect(() => {
          elricExpect(() => {
            throw new CustomError('Invalid array length');
          }).not[toThrow]('array');
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but message should not match (non-error truthy)', () => {
        expect(() => {
          elricExpect(() => {
            // eslint-disable-next-line no-throw-literal
            throw 'Internal Server Error';
          }).not[toThrow]('Server Error');
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('regexp', () => {
      it('passes', () => {
        elricExpect(() => {
          throw new CustomError('apple');
        })[toThrow](/apple/);
        elricExpect(() => {
          throw new CustomError('banana');
        }).not[toThrow](/apple/);
        elricExpect(() => {}).not[toThrow](/apple/);
      });

      test('did not throw at all', () => {
        expect(() =>
          elricExpect(() => {})[toThrow](/apple/),
        ).toThrowErrorMatchingSnapshot();
      });

      test('threw, but message did not match (error)', () => {
        expect(() => {
          elricExpect(() => {
            throw new CustomError('apple');
          })[toThrow](/banana/);
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but message did not match (non-error falsey)', () => {
        expect(() => {
          elricExpect(() => {
            // eslint-disable-next-line no-throw-literal
            throw 0;
          })[toThrow](/^[123456789]\d*/);
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but message should not match (error)', () => {
        expect(() => {
          elricExpect(() => {
            throw new CustomError('Invalid array length');
          }).not[toThrow](/ array /);
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but message should not match (non-error truthy)', () => {
        expect(() => {
          elricExpect(() => {
            // eslint-disable-next-line no-throw-literal
            throw 404;
          }).not[toThrow](/^[123456789]\d*/);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('error class', () => {
      class SubErr extends Err {
        constructor(message?: string) {
          super(message);
          // In a carefully written error subclass,
          // name property is equal to constructor name.
          this.name = this.constructor.name;
        }
      }

      class SubSubErr extends SubErr {
        constructor(message?: string) {
          super(message);
          // In a carefully written error subclass,
          // name property is equal to constructor name.
          this.name = this.constructor.name;
        }
      }

      it('passes', () => {
        elricExpect(() => {
          throw new Err();
        })[toThrow](Err);
        elricExpect(() => {
          throw new Err();
        })[toThrow](CustomError);
        elricExpect(() => {
          throw new Err();
        }).not[toThrow](Err2);
        elricExpect(() => {}).not[toThrow](Err);
      });

      test('did not throw at all', () => {
        expect(() =>
          expect(() => {})[toThrow](Err),
        ).toThrowErrorMatchingSnapshot();
      });

      test('threw, but class did not match (error)', () => {
        expect(() => {
          elricExpect(() => {
            throw new Err('apple');
          })[toThrow](Err2);
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but class did not match (non-error falsey)', () => {
        expect(() => {
          elricExpect(() => {
            // eslint-disable-next-line no-throw-literal
            throw undefined;
          })[toThrow](Err2);
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but class should not match (error)', () => {
        expect(() => {
          elricExpect(() => {
            throw new Err('apple');
          }).not[toThrow](Err);
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but class should not match (error subclass)', () => {
        expect(() => {
          elricExpect(() => {
            throw new SubErr('apple');
          }).not[toThrow](Err);
        }).toThrowErrorMatchingSnapshot();
      });

      test('threw, but class should not match (error subsubclass)', () => {
        expect(() => {
          elricExpect(() => {
            throw new SubSubErr('apple');
          }).not[toThrow](Err);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('error-message', () => {
      // Received message in report if object has message property.
      class ErrorMessage {
        // not extending Error!
        constructor(message) {
          this.message = message;
        }
      }
      const expected = new ErrorMessage('apple');

      describe('pass', () => {
        test('isNot false', () => {
          elricExpect(() => {
            throw new ErrorMessage('apple');
          })[toThrow](expected);
        });

        test('isNot true', () => {
          elricExpect(() => {
            throw new ErrorMessage('banana');
          }).not[toThrow](expected);
        });
      });

      describe('fail', () => {
        test('isNot false', () => {
          expect(() =>
            elricExpect(() => {
              throw new ErrorMessage('banana');
            })[toThrow](expected),
          ).toThrowErrorMatchingSnapshot();
        });

        test('isNot true', () => {
          const message = 'Invalid array length';
          expect(() =>
            elricExpect(() => {
              throw new ErrorMessage(message);
            }).not[toThrow]({message}),
          ).toThrowErrorMatchingSnapshot();
        });

        test('multiline diff highlight incorrect expected space', () => {
          // elric/issues/2673
          const a =
            "There is no route defined for key Settings. \nMust be one of: 'Home'";
          const b =
            "There is no route defined for key Settings.\nMust be one of: 'Home'";
          expect(() =>
            elricExpect(() => {
              throw new ErrorMessage(b);
            })[toThrow]({message: a}),
          ).toThrowErrorMatchingSnapshot();
        });
      });
    });

    describe('asymmetric', () => {
      describe('any-Class', () => {
        describe('pass', () => {
          test('isNot false', () => {
            elricExpect(() => {
              throw new Err('apple');
            })[toThrow](expect.any(Err));
          });

          test('isNot true', () => {
            elricExpect(() => {
              throw new Err('apple');
            }).not[toThrow](expect.any(Err2));
          });
        });

        describe('fail', () => {
          test('isNot false', () => {
            expect(() =>
              elricExpect(() => {
                throw new Err('apple');
              })[toThrow](expect.any(Err2)),
            ).toThrowErrorMatchingSnapshot();
          });

          test('isNot true', () => {
            expect(() =>
              elricExpect(() => {
                throw new Err('apple');
              }).not[toThrow](expect.any(Err)),
            ).toThrowErrorMatchingSnapshot();
          });
        });
      });

      describe('anything', () => {
        describe('pass', () => {
          test('isNot false', () => {
            elricExpect(() => {
              throw new CustomError('apple');
            })[toThrow](expect.anything());
          });

          test('isNot true', () => {
            elricExpect(() => {}).not[toThrow](expect.anything());
            elricExpect(() => {
              // eslint-disable-next-line no-throw-literal
              throw null;
            }).not[toThrow](expect.anything());
          });
        });

        describe('fail', () => {
          test('isNot false', () => {
            expect(() =>
              elricExpect(() => {
                // eslint-disable-next-line no-throw-literal
                throw null;
              })[toThrow](expect.anything()),
            ).toThrowErrorMatchingSnapshot();
          });

          test('isNot true', () => {
            expect(() =>
              elricExpect(() => {
                throw new CustomError('apple');
              }).not[toThrow](expect.anything()),
            ).toThrowErrorMatchingSnapshot();
          });
        });
      });

      describe('no-symbol', () => {
        // Test serialization of asymmetric matcher which has no property:
        // this.$$typeof = Symbol.for('elric.asymmetricMatcher')
        const matchError = {
          asymmetricMatch(received: Error | null | undefined) {
            return (
              received !== null &&
              received !== undefined &&
              received.name === 'Error'
            );
          },
        };
        const matchNotError = {
          asymmetricMatch(received: Error | null | undefined) {
            return (
              received !== null &&
              received !== undefined &&
              received.name !== 'Error'
            );
          },
        };

        describe('pass', () => {
          test('isNot false', () => {
            elricExpect(() => {
              throw new CustomError('apple');
            })[toThrow](matchError);
          });

          test('isNot true', () => {
            elricExpect(() => {
              throw new CustomError('apple');
            }).not[toThrow](matchNotError);
          });
        });

        describe('fail', () => {
          test('isNot false', () => {
            expect(() =>
              elricExpect(() => {
                throw new CustomError('apple');
              })[toThrow](matchNotError),
            ).toThrowErrorMatchingSnapshot();
          });

          test('isNot true', () => {
            expect(() =>
              elricExpect(() => {
                throw new CustomError('apple');
              }).not[toThrow](matchError),
            ).toThrowErrorMatchingSnapshot();
          });
        });
      });

      describe('objectContaining', () => {
        const matchError = expect.objectContaining({
          name: 'Error',
        });
        const matchNotError = expect.objectContaining({
          name: 'NotError',
        });

        describe('pass', () => {
          test('isNot false', () => {
            elricExpect(() => {
              throw new CustomError('apple');
            })[toThrow](matchError);
          });

          test('isNot true', () => {
            elricExpect(() => {
              throw new CustomError('apple');
            }).not[toThrow](matchNotError);
          });
        });

        describe('fail', () => {
          test('isNot false', () => {
            expect(() =>
              elricExpect(() => {
                throw new CustomError('apple');
              })[toThrow](matchNotError),
            ).toThrowErrorMatchingSnapshot();
          });

          test('isNot true', () => {
            expect(() =>
              elricExpect(() => {
                throw new CustomError('apple');
              }).not[toThrow](matchError),
            ).toThrowErrorMatchingSnapshot();
          });
        });
      });
    });

    describe('promise/async throws if Error-like object is returned', () => {
      const asyncFn = async (shouldThrow?: boolean, resolve?: boolean) => {
        let err;
        if (shouldThrow) {
          err = new Err('async apple');
        }
        if (resolve) {
          return await Promise.resolve(err || 'apple');
        } else {
          return await Promise.reject(err || 'apple');
        }
      };

      test('passes', async () => {
        expect.assertions(24);
        await elricExpect(Promise.reject(new Error())).rejects[toThrow]();

        await elricExpect(asyncFn(true)).rejects[toThrow]();
        await elricExpect(asyncFn(true)).rejects[toThrow](Err);
        await elricExpect(asyncFn(true)).rejects[toThrow](Error);
        await elricExpect(asyncFn(true)).rejects[toThrow]('apple');
        await elricExpect(asyncFn(true)).rejects[toThrow](/app/);

        await elricExpect(asyncFn(true)).rejects.not[toThrow](Err2);
        await elricExpect(asyncFn(true)).rejects.not[toThrow]('banana');
        await elricExpect(asyncFn(true)).rejects.not[toThrow](/banana/);

        await elricExpect(asyncFn(true, true)).resolves[toThrow]();

        await elricExpect(asyncFn(false, true)).resolves.not[toThrow]();
        await elricExpect(asyncFn(false, true)).resolves.not[toThrow](Error);
        await elricExpect(asyncFn(false, true)).resolves.not[toThrow]('apple');
        await elricExpect(asyncFn(false, true)).resolves.not[toThrow](/apple/);
        await elricExpect(asyncFn(false, true)).resolves.not[toThrow]('banana');
        await elricExpect(asyncFn(false, true)).resolves.not[toThrow](/banana/);

        await elricExpect(asyncFn()).rejects.not[toThrow]();
        await elricExpect(asyncFn()).rejects.not[toThrow](Error);
        await elricExpect(asyncFn()).rejects.not[toThrow]('apple');
        await elricExpect(asyncFn()).rejects.not[toThrow](/apple/);
        await elricExpect(asyncFn()).rejects.not[toThrow]('banana');
        await elricExpect(asyncFn()).rejects.not[toThrow](/banana/);

        // Works with nested functions inside promises
        await elricExpect(
          Promise.reject(() => {
            throw new Error();
          }),
        ).rejects[toThrow]();
        await elricExpect(Promise.reject(() => {})).rejects.not[toThrow]();
      });

      test('did not throw at all', async () => {
        await expect(
          elricExpect(asyncFn()).rejects[toThrow](),
        ).rejects.toThrowErrorMatchingSnapshot();
      });

      test('threw, but class did not match', async () => {
        await expect(
          elricExpect(asyncFn(true)).rejects[toThrow](Err2),
        ).rejects.toThrowErrorMatchingSnapshot();
      });

      test('threw, but should not have', async () => {
        await expect(
          elricExpect(asyncFn(true)).rejects.not[toThrow](),
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });

    describe('expected is undefined', () => {
      test('threw, but should not have (non-error falsey)', () => {
        expect(() => {
          elricExpect(() => {
            // eslint-disable-next-line no-throw-literal
            throw null;
          }).not[toThrow]();
        }).toThrowErrorMatchingSnapshot();
      });
    });

    test('invalid arguments', () => {
      expect(() =>
        elricExpect(() => {}).not[toThrow](111),
      ).toThrowErrorMatchingSnapshot();
    });

    test('invalid actual', () => {
      expect(() =>
        elricExpect('a string')[toThrow](),
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
