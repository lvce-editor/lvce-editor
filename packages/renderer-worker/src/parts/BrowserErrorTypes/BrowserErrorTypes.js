export const BrowserErrorNames = {
  NotAllowedError: 'NotAllowedError',
  UnknownError: 'UnknownError',
}

export const isNotAllowedError = (error) => {
  return error && error.name === BrowserErrorNames.NotAllowedError
}
