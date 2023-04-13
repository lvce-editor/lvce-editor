import * as OutputChannels from '../OutputChannels/OutputChannels.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const create = () => {
  return {
    selectedIndex: -1,
    // TODO get list of outputChannels from extension host
    options: [],
    disposed: false,
  }
}

export const loadContent = async (state) => {
  const options = await OutputChannels.getOptions()
  const selectedIndex = 0
  // TODO duplicate send here
  await SharedProcess.invoke(/* OutputChannel.open */ 'OutputChannel.open', /* id */ 0, /* path */ options[selectedIndex].file)
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
  await SharedProcess.invoke(/* OutputChannel.open */ 'OutputChannel.open', /* id */ 'Output', /* path */ state.selectedOption)
}

export const handleData = async (state, data) => {
  console.log({ handleData: data })
  await RendererProcess.invoke(/* Viewlet.invoke */ 'Viewlet.send', /* id */ 'Output', /* method */ 'append', /* data */ data)
}

export const handleError = async (state, data) => {
  console.log({ handleData: data })
  await RendererProcess.invoke(/* Viewlet.invoke */ 'Viewlet.send', /* id */ 'Output', /* method */ 'append', /* data */ data)
}

export const dispose = async (state) => {
  state.disposed = true
  // TODO close output channel in shared process
  await SharedProcess.invoke(/* OutputChannel.close */ 'OutputChannel.close', /* id */ 'Output')
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
