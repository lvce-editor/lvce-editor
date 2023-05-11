import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Terminal from '../Terminal/Terminal.js'
import * as Workspace from '../Workspace/Workspace.js'
// TODO implement a functional terminal component, maybe using offscreencanvas

export const create = (id) => {
  Assert.number(id)
  return {
    disposed: false,
    id: 0,
    uid: id,
  }
}

export const loadContent = async (state) => {
  // TODO this should be async and open a pty
  return {
    ...state,
    id: Id.create(),
  }
}

export const contentLoadedEffects = async (state) => {
  await Terminal.create(state.id, Workspace.state.workspacePath)
}

export const handleData = async (state, data) => {
  const uid = state.uid
  // Terminal.handleData(state, data)
  const parsedData = new Uint8Array(data.data)
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ uid, /* method */ 'write', /* data */ parsedData)
}

export const write = async (state, input) => {
  await Terminal.write(state.id, input)
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const resize = async (state, width, height) => {
  // TODO columnWidth etc. should be in renderer process
  const columnWidth = 8.43332
  const rowHeight = 14
  // const columns = Math.round(width / columnWidth)
  const columns = 7
  const rows = Math.round(height / rowHeight)
  await Terminal.resize(state.id, columns, rows)

  // Terminal.resize(state, width, height)
}

export const clear = async (state) => {
  await RendererProcess.invoke(/* ViewletTerminal.write */ 'Terminal.write', /* data */ new TextEncoder().encode('TODO clear terminal'))
}
