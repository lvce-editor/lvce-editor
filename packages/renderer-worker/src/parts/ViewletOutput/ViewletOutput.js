import * as OutputChannel from '../OutputChannel/OutputChannel.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = () => {
  return {
    selectedIndex: -1,
    // TODO get list of outputChannels from extension host
    options: [],
    disposed: false,
  }
}

export const loadContent = async (state) => {
  // TODO get list of outputChannels from extension host

  const options = await OutputChannel.getOutputChannelOptions()
  const selectedIndex = 0
  // TODO duplicate send here
  const path = options[selectedIndex].file
  await OutputChannel.open(/* id */ 0, /*path */ path)
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
  // TODO should use
  await OutputChannel.open('Output', state.selectedOption)
}

export const handleData = async (state, data) => {
  await RendererProcess.invoke(/* Viewlet.invoke */ 'Viewlet.send', /* id */ 'Output', /* method */ 'append', /* data */ data)
}

export const handleError = (state, error) => {
  console.log(error)
}

export const dispose = async (state) => {
  state.disposed = true
  // TODO close output channel in shared process
  await OutputChannel.dispose('Output')
}

export const openFindWidget = async (state) => {
  // TODO use command.execute instead
  // TODO no lazy import here
}

export const closeFindWidget = async (state) => {}

// export const handleError = (state, error) => {
//   console.error(error)
// }

export const render = []
