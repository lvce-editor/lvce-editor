import * as DomExceptionType from '../DomExceptionType/DomExceptionType.js'

export const isNotAllowedError = (error) => {
  return error && error.name === DomExceptionType.NotAllowedError
}

export const isNotFoundError = (error) => {
  return error && error.name === DomExceptionType.NotFoundError
}
