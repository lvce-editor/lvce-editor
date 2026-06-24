import * as Assert from '../Assert/Assert.ts'
import * as Focus from '../Focus/Focus.js'
import * as GetTerminalSpawnOptions from '../GetTerminalSpawnOptions/GetTerminalSpawnOptions.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TerminalWorker from '../TerminalWorker/TerminalWorker.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import * as Workspace from '../Workspace/Workspace.js'

const renderer = 'xterm'
const defaultBackend = 'real'

const getBackend = () => {
  return Preferences.get('terminal.backend') || defaultBackend
}

export const create = (id) => {
  Assert.number(id)
  return {
    disposed: false,
    id: 0,
    uid: id,
    separateConnection: true,
    command: '',
    args: [],
    setBounds: false,
    columns: 80,
    rows: 24,
  }
}

export const loadContent = async (state) => {
  const { uid } = state
  const { command, args } = await GetTerminalSpawnOptions.getTerminalSpawnOptions()
  await TerminalWorker.invoke('Terminal.create', uid, Workspace.state.workspacePath, command, args, {
    backend: getBackend(),
    renderer,
  })
  return {
    ...state,
    command,
    args,
  }
}

export const handleInput = async (state, data) => {
  await TerminalWorker.invoke('Terminal.write', state.uid, data)
  return state
}

export const handleData = async (state, data) => {
  await RendererProcess.invoke('Viewlet.send', state.uid, 'write', data)
  return state
}

export const handleBlur = (state) => {
  return state
}

export const dispose = async (state) => {
  await TerminalWorker.invoke('Terminal.dispose', state.uid)
  return {
    ...state,
    disposed: true,
  }
}

export const handleKeyDown = (state) => {
  return state
}

export const handleMouseDown = (state) => {
  Focus.setFocus(WhenExpression.FocusTerminal)
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
  const columns = state.columns || Math.max(2, Math.floor(state.width / 9))
  const rows = state.rows || Math.max(2, Math.floor(state.height / 17))
  await TerminalWorker.invoke('Terminal.resize', state.uid, columns, rows)
}

export const focus = (state) => {
  return {
    ...state,
    focused: true,
  }
}

export const clear = async (state) => {
  await RendererProcess.invoke('Viewlet.send', state.uid, 'write', new TextEncoder().encode('\u001Bc'))
  return state
}
