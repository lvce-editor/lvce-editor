import * as Id from '../Id/Id.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'
import * as Terminal from '../Terminal/Terminal.js'
import * as TerminalWorker from '../TerminalWorker/TerminalWorker.js'
import * as TerminalWorkerFunctions from '../TerminalWorkerFunctions/TerminalWorkerFunctions.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.Terminal2

export const create = () => {
  return {
    disposed: false,
    id: 0,
  }
}

export const loadContent = async (state) => {
  const ipc = await TerminalWorker.create({
    method: IpcParentType.MessagePort,
  })
  const canvasId = Id.create()
  const canvas = await OffscreenCanvas.create(canvasId)
  await TerminalWorkerFunctions.addCanvas(ipc, canvasId, canvas)
  await TerminalWorkerFunctions.createConnection(ipc)
  await TerminalWorkerFunctions.render(ipc, canvasId)
  return {
    ...state,
    id: Id.create(),
    canvasId,
    ipc,
  }
}

export const handleData = async (state, data) => {
  // Terminal.handleData(state, data)
  const parsedData = new Uint8Array(data.data)
  // await RendererProcess.invoke(
  //   /* Viewlet.send */ 'Viewlet.send',
  //   /* id */ 'Terminal',
  //   /* method */ 'write',
  //   /* data */ parsedData
  // )
}

export const write = async (state, input) => {
  const { id } = state
  await Terminal.write(id, input)
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const resize = async (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const resizeEffect = async (state) => {
  const { id } = state
  // TODO columnWidth etc. should be in renderer process
  const columnWidth = 8.43332
  const rowHeight = 14
  // const columns = Math.round(width / columnWidth)
  const columns = 7
  // const rows = Math.round(height / rowHeight)

  // await Terminal.resize(id, columns, rows)
}

export const clear = async (state) => {
  await Terminal.clear()
}

export const hasFunctionalRender = true

const renderCanvas = {
  isEqual(oldState, newState) {
    return oldState.canvasId === newState.canvasId
  },
  apply(oldState, newState) {
    return [
      'Viewlet.send',
      ViewletModuleId.Terminal2,
      'setCanvas',
      newState.canvasId,
    ]
  },
}

export const render = [renderCanvas]
