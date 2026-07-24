import * as PrettyError from '../PrettyError/PrettyError.js'

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.length > 0
}

const getMessage = (error) => {
  if (error?.type && error?.message) {
    const prefix = `${error.type}: `
    return error.message.startsWith(prefix) ? error.message : `${prefix}${error.message}`
  }
  return PrettyError.getMessage(error)
}

export const getViewletErrorMessage = (error) => {
  const message = getMessage(error)
  return [message, error?.codeFrame, error?.stack].filter(isNonEmptyString).join('\n\n')
}
