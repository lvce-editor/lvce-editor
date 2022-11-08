import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as OutputChannel from '../OutputChannel/OutputChannel.js'

export const name = ViewletModuleId.Output

export const create = () => {
  return {
    selectedIndex: -1,
    options: [],
    disposed: false,
  }
}

const toOption = (outputChannel) => {
  return {
    name: outputChannel.name,
    path: outputChannel.path,
  }
}

export const loadContent = async (state) => {
  const channels = await OutputChannel.getOutputChannels()
  const options = channels.map(toOption)
  const selectedIndex = 0
  return {
    ...state,
    options,
    selectedIndex,
  }
}

export const contentLoadedEffects = async (state) => {
  const { options, selectedIndex } = state
  const option = options[selectedIndex]
  const { path } = option
  await OutputChannel.open(0, path)
}

export const setOutputChannel = async (state, option) => {
  await OutputChannel.open(option)
  return {
    ...state,
    selectedOption: option,
    text: '',
  }
}

export const handleData = (state, data) => {
  const { text } = state
  return {
    ...state,
    text: text + data,
  }
}

export const dispose = async (state) => {
  // TODO close output channel in shared process
  await OutputChannel.close('Output')
  return {
    ...state,
    disposed: true,
  }
}

export const openFindWidget = async (state) => {
  // TODO use command.execute instead
  // TODO no lazy import here
}

export const closeFindWidget = async (state) => {}

export const handleError = (state, error) => {
  return {
    ...state,
    text: `${error}`,
  }
}

const renderText = {
  isEqual(oldState, newState) {
    return oldState.text === newState.text
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Output,
      /* method */ 'setText',
      /* text */ newState.text,
    ]
  },
}

const renderOptions = {
  isEqual(oldState, newState) {
    return oldState.options === newState.options
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Output,
      /* method */ 'setOptions',
      /* options */ newState.options,
    ]
  },
}

export const render = [renderText, renderOptions]
