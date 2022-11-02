import * as Id from '../Id/Id.js'
import * as Terminal from '../Terminal/Terminal.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Workspace from '../Workspace/Workspace.js'

export const name = ViewletModuleId.Terminal2

export const create = () => {
  return {
    disposed: false,
    id: 0,
  }
}

export const loadContent = async (state) => {
  const id = Id.create()
  await Terminal.create(id, Workspace.state.workspacePath)
  return {
    ...state,
    id: Id.create(),
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
  const rows = Math.round(height / rowHeight)

  await Terminal.resize(id, columns, rows)
}

export const clear = async (state) => {
  await Terminal.clear()
}

export const hasFunctionalRender = true

export const render = []
