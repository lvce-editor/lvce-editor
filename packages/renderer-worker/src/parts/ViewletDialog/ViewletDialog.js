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

const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error
  }
  if (error.type && error.message) {
    return `${error.type}: ${error.message}`
  }
  if (error.message) {
    return `${error.message}`
  }
  return `${error}`
}

export const loadContent = (state, savedState, ...args) => {
  const [options, buttons] = args
  const { message, codeFrame, stack, type } = options
  const normalizedMessage = getErrorMessage(message)
  console.log({ normalizedMessage, message })
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
      const uri = `data://`
      await Command.execute(/* Main.openUri */ 'Main.openUri', uri)
      // TODO show stderr in editor
      // TODO close dialog
      break
    default:
      break
  }
}

export const hasFunctionalRender = true

const renderHeader = {
  isEqual(oldState, newState) {
    return oldState.header === newState.header
  },
  apply(oldState, newState) {
    return [/* method */ 'setHeader', newState.header]
  },
}

const renderButtons = {
  isEqual(oldState, newState) {
    return oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    return [/* method */ 'setButtons', newState.buttons]
  },
}

const renderCodeFrame = {
  isEqual(oldState, newState) {
    return oldState.codeFrame === newState.codeFrame
  },
  apply(oldState, newState) {
    return [/* method */ 'setCodeFrame', newState.codeFrame]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ 'setErrorMessage', newState.message]
  },
}

const renderStack = {
  isEqual(oldState, newState) {
    return oldState.stack === newState.stack
  },
  apply(oldState, newState) {
    return [/* method */ 'setErrorStack', newState.stack]
  },
}

export const render = [renderHeader, renderButtons, renderCodeFrame, renderMessage, renderStack]
