import * as OutputChannel from '../OutputChannel/OutputChannel.js'
import * as OutputChannels from '../OutputChannels/OutputChannels.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = () => {
  return {
    selectedIndex: -1,
    // TODO get list of outputChannels from extension host
    options: [],
    disposed: false,
    text: '',
  }
}

export const loadContent = async (state) => {
  const options = await OutputChannels.getOptions()
  const selectedIndex = 0
  // TODO duplicate send here
  const id = 0
  const file = options[selectedIndex].file
  await OutputChannel.open(id, file)
  return {
    ...state,
    options,
    selectedIndex,
  }
}

export const contentLoaded = async (state) => {
  return [
    [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'Output',
      /* method */ 'setOptions',
      /* options */ state.options,
      /* selectedOptionIndex */ state.selectedIndex,
    ],
  ]
}

export const setOutputChannel = async (state, option) => {
  state.selectedOption = option
  // TODO race condition
  await RendererProcess.invoke(/* viewletSend */ 'Viewlet.send', /* id */ 'Output', /* method */ 'clear')
  // TODO race condition
  // TODO should use invoke
  await OutputChannel.open('Output', state.selectedOption)
}

export const handleData = async (state, data) => {
  const { text } = state
  const newText = text + data
  return {
    ...state,
    text: newText,
  }
}

export const handleError = async (state, data) => {
  const { text } = state
  const newText = text + data
  return {
    ...state,
    text: newText,
  }
}

export const dispose = async (state) => {
  state.disposed = true
  // TODO close output channel in shared process
  await OutputChannel.close('Output')
}

export const openFindWidget = async (state) => {
  // TODO use command.execute instead
  // TODO no lazy import here
}

export const closeFindWidget = async (state) => {}

// export const handleError = (state, error) => {
//   console.error(error)
// }

const renderText = {
  isEqual(oldState, newState) {
    return oldState.text === newState.text
  },
  apply(oldState, newState) {
    return ['setText', newState.text]
  },
}

export const hasFunctionalRender = true

export const render = [renderText]
