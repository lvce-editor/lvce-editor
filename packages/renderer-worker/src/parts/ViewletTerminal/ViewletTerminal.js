import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Id from '../Id/Id.js'

export const name = 'Terminal'

export const create = () => {
  return {
    disposed: false,
    id: 0,
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
  // TODO this should be invoke
  SharedProcess.send(
    /* createTerminal */ 'Terminal.create',
    /* id */ state.id,
    /* cwd */ Workspace.state.workspacePath
  )
}

export const handleData = async (state, data) => {
  // Terminal.handleData(state, data)
  const parsedData = new Uint8Array(data.data)
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Terminal',
    /* method */ 'write',
    /* data */ parsedData
  )
}

export const write = async (state, input) => {
  await SharedProcess.invoke(
    /* Terminal.write */ 'Terminal.write',
    /* id */ state.id,
    /* input */ input
  )
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
  await SharedProcess.invoke(
    /* Terminal.resize */ 'Terminal.resize',
    /* id */ state.id,
    /* columns */ columns,
    /* rows */ rows
  )

  // Terminal.resize(state, width, height)
}

export const clear = async (state) => {
  await RendererProcess.invoke(
    /* ViewletTerminal.write */ 'Terminal.write',
    /* data */ new TextEncoder().encode('TODO clear terminal')
  )
}
