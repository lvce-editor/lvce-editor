import * as Command from '../Command/Command.js'

export const create = () => {
  return {
    message: '',
    codeFrame: '',
    stack: '',
    type: '',
    header: '',
    buttons: [],
  }
}

const getErrorMessage = (type, message) => {
  if (type && message) {
    return `${type}: ${message}`
  }
  if (message) {
    return `${message}`
  }
  return `${message}`
}

export const loadContent = (state, savedState, ...args) => {
  const [options, buttons] = args
  const { message, codeFrame, stack, type } = options
  const normalizedMessage = getErrorMessage(type, message)
  return {
    ...state,
    message: normalizedMessage,
    codeFrame,
    stack,
    type,
    header: 'Extension Error',
    buttons,
  }
}

export const dispose = async (state) => {}

export const handleClick = async (state, index) => {
  const { options } = state
  const option = options[index]
  // TODO handle case when index is out of bounds
  switch (option) {
    case 'Show Command Output':
      await dispose()
      const uri = 'data://'
      await Command.execute(/* Main.openUri */ 'Main.openUri', uri)
      // TODO show stderr in editor
      // TODO close dialog
      break
    default:
      break
  }
}
