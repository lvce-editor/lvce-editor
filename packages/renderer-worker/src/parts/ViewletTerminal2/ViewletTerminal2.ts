import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as Focus from '../Focus/Focus.js'
import * as GetTerminalSpawnOptions from '../GetTerminalSpawnOptions/GetTerminalSpawnOptions.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TerminalTransfer from '../TerminalTransfer/TerminalTransfer.js'
import * as TerminalWorker from '../TerminalWorker/TerminalWorker.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import * as Workspace from '../Workspace/Workspace.js'

const defaultBackend = 'real'

const getBackend = () => {
  return Preferences.get('terminal.backend') || defaultBackend
}

export const create = (id, cwd = '') => {
  Assert.number(id)
  return {
    args: [],
    columns: 80,
    command: '',
    cwd,
    disposed: false,
    id: 0,
    rows: 24,
    separateConnection: true,
    setBounds: false,
    uid: id,
    workspaceUri: Workspace.state.workspaceUri || '',
    xtermMounted: false,
  }
}

export const loadContent = async (state, _savedState?: any, configuredSpawnOptions?: any) => {
  const {
    args,
    command,
    cwd = state.cwd,
    disposeCommand,
    env,
    keepOpen = false,
    spawnError,
  } = configuredSpawnOptions || (await GetTerminalSpawnOptions.getTerminalSpawnOptions(state.cwd))
  return {
    ...state,
    args,
    command,
    cwd,
    disposeCommand,
    env,
    keepOpen,
    spawnError,
    xtermMounted: true,
  }
}

export const loadContentLater = async (state) => {
  const { args, command, cwd, env, spawnError, uid } = state
  if (spawnError) {
    await handleData(state, new TextEncoder().encode(`\r\n${spawnError}\r\n`))
    return
  }
  try {
    await TerminalWorker.invoke('Terminal.create', uid, cwd || Workspace.state.workspacePath, command, args, {
      backend: getBackend(),
      ...(env && { env }),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await showError(state, `Failed to start terminal${state.keepOpen ? ` (${command})` : ''}: ${message}`)
  }
}

const showError = async (state, message) => {
  const workspaceChanged = message.includes('Workspace changed while starting the terminal.')
  const diagnostic = workspaceChanged ? message.replace(' Create a new terminal to retry.', '') : message
  const recovery = workspaceChanged
    ? 'Create a new terminal to retry.'
    : 'Check the shell, working directory, and workspace connection. Create a new terminal to retry.'
  const text = `${diagnostic}\r\n${recovery}\r\n`
  await handleData(state, new TextEncoder().encode(`\r\n${text}`))
}

export const handleInput = async (state, data) => {
  if (state.spawnError) {
    return state
  }
  await TerminalWorker.invoke('Terminal.write', state.uid, data)
  return state
}

export const handleLink = async (state, uri) => {
  Assert.string(uri)
  if (!URL.canParse(uri) || !/^https?:\/\//i.test(uri)) {
    return state
  }
  const workspaceUri = state.workspaceUri || (state.cwd?.startsWith('remote-server://') ? state.cwd : Workspace.state.workspaceUri)
  const target = new URL(uri)
  if (workspaceUri?.startsWith('remote-server://') && ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname)) {
    const resolved = await ExtensionHostCommands.executeCommand('remote-server.resolveHttpPreview', workspaceUri, uri)
    Assert.string(resolved)
    uri = resolved
  }
  await Command.execute('Layout.showPreview', 'simple-browser://')
  const { previewId } = ViewletStates.getState(ViewletModuleId.Layout)
  await Viewlet.executeViewletCommand(previewId, 'openTab', uri, 'foreground-tab')
  return state
}

export const handleData = async (state, data) => {
  await RendererProcess.invoke('Viewlet.send', state.uid, 'write', data)
  return state
}

export const handleExit = async (state, event?: { exitCode?: number; signal?: number }) => {
  if (event?.exitCode || event?.signal) {
    const processName = state.keepOpen ? `The terminal process (${state.command})` : 'The terminal process'
    const message = event.signal ? `${processName} exited with signal ${event.signal}.` : `${processName} exited with code ${event.exitCode}.`
    await showError(state, message)
    return state
  }
  if (state.keepOpen) {
    await handleData(state, new TextEncoder().encode('\r\nProcess exited with code 0.\r\n'))
    return state
  }
  if (!(await TerminalTransfer.handleExit(state.uid))) {
    await Command.execute('Terminals.handleTerminalExit', state.uid)
  }
  return state
}

export const handleBlur = (state) => {
  return state
}

export const dispose = async (state) => {
  TerminalTransfer.forget(state.uid)
  try {
    if (state.disposeCommand) {
      await ExtensionHostCommands.executeCommand(state.disposeCommand.command, ...state.disposeCommand.args)
    }
  } catch (error) {
    console.warn('Failed to clean up the remote terminal', error)
  } finally {
    if (!state.spawnError) {
      await TerminalWorker.invoke('Terminal.dispose', state.uid)
    }
  }
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

export const resize = async (state, dimensions) => {
  const resized = {
    ...state,
    ...dimensions,
  }
  const columns = resized.columns || Math.max(2, Math.floor(resized.width / 9))
  const rows = resized.rows || Math.max(2, Math.floor(resized.height / 17))
  if (!state.spawnError) {
    await TerminalWorker.invoke('Terminal.resize', state.uid, columns, rows)
  }
  return resized
}

export const focus = (state) => {
  return {
    ...state,
    focused: true,
  }
}

export const clear = async (state) => {
  await RendererProcess.invoke('Viewlet.send', state.uid, 'write', new TextEncoder().encode('\u{1B}c'))
  return state
}
