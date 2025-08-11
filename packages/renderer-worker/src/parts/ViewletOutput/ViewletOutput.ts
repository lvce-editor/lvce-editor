import * as OutputChannel from '../OutputChannel/OutputChannel.js'
import * as OutputChannels from '../OutputChannels/OutputChannels.js'
import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = (uid: any) => {
  return {
    uid,
    selectedIndex: -1,
    // TODO get list of outputChannels from extension host
    options: [],
    disposed: false,
    text: '',
  }
}

export const loadContent = async (state) => {
  await OutputViewWorker.invoke('Output.create', state.id)
  await OutputViewWorker.invoke('Output.loadContent2', state.id)
  const diffResult = await OutputViewWorker.invoke('Output.diff2', state.id)
  const commands = await OutputViewWorker.invoke('Output.render2', state.id, diffResult)
  return {
    ...state,
    commands,
  }
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
