import RError from '../../../../../static/js/rerror.js'

// utility for nested errors
// there are multiple packages on npm
// 1. VError (mostly used for node)
// 2. RError
// 3. TraceError
// used until Error.cause is better supported by chrome devtools

export class NestedError extends RError {
  constructor({ cause, message }) {
    super({
      message,
      cause,
      name: 'Nested Error',
    })
  }
}
