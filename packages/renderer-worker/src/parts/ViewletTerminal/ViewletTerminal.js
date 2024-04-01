import * as Assert from '../Assert/Assert.js'
import * as GetTerminalSpawnOptions from '../GetTerminalSpawnOptions/GetTerminalSpawnOptions.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TerminalWorker from '../TerminalWorker/TerminalWorker.js'
import * as ToUint8Array from '../ToUint8Array/ToUint8Array.js'
import * as Workspace from '../Workspace/Workspace.js'

// TODO implement a functional terminal component, maybe using offscreencanvas

export const create = (id) => {
  Assert.number(id)
  const separateConnection = true
  return {
    disposed: false,
    id: 0,
    uid: id,
    separateConnection,
    command: '',
    args: [],
    setBounds: false,
  }
}

export const loadContent = async (state) => {
  // TODO this should be async and open a pty
  const { uid } = state
  const { command, args } = await GetTerminalSpawnOptions.getTerminalSpawnOptions()
  const canvasTextId = Id.create()
  const canvasCursorId = Id.create()
  await TerminalWorker.getOrCreate()
  await TerminalWorker.invoke('Terminal.create', canvasTextId, canvasCursorId, uid, Workspace.state.workspacePath, command, args)
  const terminal = {
    write(data) {
      return TerminalWorker.invoke('Terminal.write', uid, data)
    },
    handleBlur() {
      return TerminalWorker.invoke('Terminal.handleBlur', uid)
    },
    handleKeyDown(key) {
      return TerminalWorker.invoke('Terminal.handleKeyDown', uid, key)
    },
    handleMouseDown() {
      return TerminalWorker.invoke('Terminal.handleMouseDown', uid)
    },
    resize() {
      // TODO
    },
  }
  return {
    ...state,
    id: Id.create(),
    command,
    args,
    canvasCursorId,
    canvasTextId,
    canvasText,
    canvasCursor,
    terminal,
  }
}

export const handleBlur = (state) => {
  const { terminal } = state
  terminal.handleBlur()
  return state
}

export const handleData = async (state, data) => {
  const { uid, terminal } = state
  const parsedData = ToUint8Array.toUint8Array(data)
  terminal.write(parsedData)
}

export const write = async (state, input) => {
  const { uid, terminal } = state
  await terminal.write(uid, input)
}

export const dispose = async (state) => {
  const { uid, terminal } = state
  await terminal.dispose(uid)
  return {
    ...state,
    disposed: true,
  }
}

export const handleKeyDown = (state, key) => {
  const { terminal } = state
  terminal.handleKeyDown(key)
  return state
}

export const handleMouseDown = (state) => {
  const { terminal } = state
  terminal.handleMouseDown()
  return state
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const resizeEffect = async (state) => {
  const { width, height } = state
  const { uid, terminal } = state
  // TODO columnWidth etc. should be in renderer process
  const columnWidth = 8.43332
  const rowHeight = 14
  // const columns = Math.round(width / columnWidth)
  const columns = 7
  const rows = Math.round(height / rowHeight)
  await terminal.resize(uid, columns, rows)

  // Terminal.resize(state, width, height)
}

export const clear = async (state) => {
  await RendererProcess.invoke(/* ViewletTerminal.write */ 'Terminal.write', /* data */ new TextEncoder().encode('TODO clear terminal'))
}
