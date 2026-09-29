import * as PrettyError from '../PrettyError/PrettyError.js'

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.length > 0
}

export const getViewletErrorTitle = (error) => {
  if (error?.type && error?.message) {
    const prefix = `${error.type}: `
    return error.message.startsWith(prefix) ? error.message : `${prefix}${error.message}`
  }
  return PrettyError.getMessage(error)
}

export const getViewletErrorStack = (error) => {
  const stack = error?.stack
  if (!isNonEmptyString(stack)) {
    return stack
  }
  const message = getViewletErrorTitle(error)
  if (stack === message) {
    return ''
  }
  for (const separator of ['\r\n', '\n']) {
    const duplicateMessage = `${message}${separator}`
    if (stack.startsWith(duplicateMessage)) {
      return stack.slice(duplicateMessage.length)
    }
  }
  return stack
}

export const getViewletErrorMessage = (error) => {
  const message = getViewletErrorTitle(error)
  const stack = getViewletErrorStack(error)
  return [message, error?.codeFrame, stack].filter(isNonEmptyString).join('\n\n')
}
