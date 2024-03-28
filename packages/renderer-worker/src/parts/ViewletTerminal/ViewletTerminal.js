import * as Assert from '../Assert/Assert.js'
import * as GetTerminalSpawnOptions from '../GetTerminalSpawnOptions/GetTerminalSpawnOptions.js'
import * as Id from '../Id/Id.js'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Terminal from '../Terminal/Terminal.js'
import * as TerminalEmulator from '../TerminalEmulator/TerminalEmulator.js'
import * as ToUint8Array from '../ToUint8Array/ToUint8Array.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
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
  const { command, args } = await GetTerminalSpawnOptions.getTerminalSpawnOptions()
  const canvasTextId = Id.create()
  const canvasCursorId = Id.create()
  const canvasText = await OffscreenCanvas.create(canvasTextId)
  const canvasCursor = await OffscreenCanvas.create(canvasCursorId)
  return {
    ...state,
    id: Id.create(),
    command,
    args,
    canvasCursorId,
    canvasTextId,
    canvasText,
    canvasCursor,
  }
}

export const contentLoadedEffects = async (state) => {
  const { uid, separateConnection, command, args, canvasCursor, canvasText } = state
  const terminal = await TerminalEmulator.create({
    offscreenCanvasCursor: canvasCursor,
    offscreenCanvasText: canvasText,
    async focusTextArea() {
      await RendererProcess.invoke('Viewlet.send', uid, 'focusTextArea')
    },
    handleInput(transformedKey) {
      Terminal.write(uid, transformedKey)
    },
  })
  ViewletStates.setState(uid, {
    ...ViewletStates.getState(uid),
    terminal,
  })
  await Terminal.create(separateConnection, uid, Workspace.state.workspacePath, command, args)
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
  const { uid } = state
  await Terminal.write(uid, input)
}

export const dispose = async (state) => {
  const { uid } = state
  await Terminal.dispose(uid)
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
  const { uid } = state
  // TODO columnWidth etc. should be in renderer process
  const columnWidth = 8.43332
  const rowHeight = 14
  // const columns = Math.round(width / columnWidth)
  const columns = 7
  const rows = Math.round(height / rowHeight)
  await Terminal.resize(uid, columns, rows)

  // Terminal.resize(state, width, height)
}

export const clear = async (state) => {
  await RendererProcess.invoke(/* ViewletTerminal.write */ 'Terminal.write', /* data */ new TextEncoder().encode('TODO clear terminal'))
}
