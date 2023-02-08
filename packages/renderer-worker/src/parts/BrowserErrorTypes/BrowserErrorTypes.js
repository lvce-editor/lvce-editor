import * as DomExceptionType from '../DomExceptionType/DomExceptionType.js'

export const isNotAllowedError = (error) => {
  return error && error.name === DomExceptionType.NotAllowedError
}

// export const isUserActivationError
