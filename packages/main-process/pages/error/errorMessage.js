const knownErrors = [
  {
    code: 'ERR_SSL_PROTOCOL_ERROR',
    message: 'This site can’t provide a secure connection',
  },
  {
    code: 'ERR_NAME_NOT_RESOLVED',
    message: 'This site can’t be reached',
  },
  {
    code: 'ERR_CONNECTION_REFUSED',
    message: "This site can't be reached",
  },
]

export const getError = (code) => {
  for (const error of knownErrors) {
    if (error.code === code) {
      return error
    }
  }
  return {
    code,
    message: 'Site could not be loaded',
  }
}
