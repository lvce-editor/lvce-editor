const ErrorType = require('../ErrorType/ErrorType.js')

exports.getErrorConstructor = (message, type) => {
  if (type) {
    switch (type) {
      case ErrorType.DomException:
        return DOMException
      case ErrorType.TypeError:
        return TypeError
      case ErrorType.SyntaxError:
        return SyntaxError
      case ErrorType.ReferenceError:
        return ReferenceError
      default:
        return Error
    }
  }
  if (message.startsWith('TypeError: ')) {
    return TypeError
  }
  if (message.startsWith('SyntaxError: ')) {
    return SyntaxError
  }
  if (message.startsWith('ReferenceError: ')) {
    return ReferenceError
  }
  return Error
}
