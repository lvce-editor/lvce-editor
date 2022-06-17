import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ExtensionHostOutputChannel from '../ExtensionHost/ExtensionHostOutput.js'

export const name = 'Output'

export const create = () => {
  return {
    selectedIndex: -1,
    // TODO get list of outputChannels from extension host
    options: [],
    disposed: false,
  }
}

const toExtensionHostOption = (outputChannel) => {
  return {
    name: outputChannel.id,
    file: outputChannel.path,
  }
}

export const loadContent = async (state) => {
  // TODO get list of outputChannels from extension host

  const channels = await ExtensionHostOutputChannel.getOutputChannels()
  const options = [
    {
      name: 'Main',
      file: '/tmp/log-main.txt',
    },
    ...channels.map(toExtensionHostOption),
  ]
  const selectedIndex = 0
  // TODO duplicate send here
  await SharedProcess.invoke(
    /* OutputChannel.open */ 'OutputChannel.open',
    /* id */ 0,
    /* path */ options[selectedIndex].file
  )
  return {
    ...state,
    options,
    selectedIndex,
  }
}

export const contentLoaded = async (state) => {
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 3024,
    /* id */ 'Output',
    /* method */ 'setOptions',
    /* options */ state.options,
    /* selectedOptionIndex */ state.selectedIndex
  )
}

export const setOutputChannel = async (state, option) => {
  state.selectedOption = option
  // TODO race condition
  await RendererProcess.invoke(
    /* viewletSend */ 3024,
    /* id */ 'Output',
    /* method */ 'clear'
  )
  // TODO race condition
  // TODO should use invoke
  await SharedProcess.invoke(
    /* OutputChannel.open */ 'OutputChannel.open',
    /* id */ 'Output',
    /* path */ state.selectedOption
  )
}

export const handleData = async (state, data) => {
  console.log({ handleData: data })
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 3024,
    /* id */ 'Output',
    /* method */ 'append',
    /* data */ data
  )
}

export const dispose = async (state) => {
  state.disposed = true
  // TODO close output channel in shared process
  await SharedProcess.invoke(
    /* OutputChannel.close */ 'OutputChannel.close',
    /* id */ 'Output'
  )
}

export const openFindWidget = async (state) => {
  // TODO use command.execute instead
  // TODO no lazy import here
  const FindWidget = await import('../FindWidget/FindWidget.js')
  FindWidget.create()
}

export const closeFindWidget = async (state) => {
  // const FindWidget = await import('../FindWidget/FindWidget.js')
  // state
  // if(state.findWidget){
  // state.findWidget.dispose()
  // }
}

export const handleError = (state, error) => {
  console.error(error)
}
