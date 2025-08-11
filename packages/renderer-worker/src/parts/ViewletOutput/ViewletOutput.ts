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

export const hotReload = async (state, option) => {
  // TODO
  return {
    ...state,
  }
}
