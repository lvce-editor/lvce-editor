import * as RuntimeConfig from '../RuntimeConfig/RuntimeConfig.ts'
import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'
import * as PreviewWorker from '../PreviewWorker/PreviewWorker.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as PreviewSandBoxWorker from '../PreviewSandBoxWorker/PreviewSandBoxWorker.js'

const workerViewlet = createWorkerViewlet({ workerId: 'preview' })
const { dispose: disposeWorkerViewlet, loadContent: loadWorkerContent } = workerViewlet
const instances = new Set()
let outputChannelActive = false

const updateOutputChannelState = async () => {
  if (RuntimeConfig.runtimeConfig.previewOutputEnabled === false) {
    return
  }
  const active = instances.size > 0
  if (outputChannelActive === active) {
    return
  }
  outputChannelActive = active
  await OutputViewWorker.invoke('Output.setPreviewSandboxActive', active)
}

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  decrement,
  getKeyBindings,
  getMenus,
  getQuickPickMenuEntries,
  getStorageKey,
  getTitle,
  hasDirectRender,
  hasFunctionalEvents,
  hasFunctionalRender,
  hasFunctionalResize,
  hasFunctionalRootRender,
  hotReload,
  increment,
  menus,
  name,
  render,
  renderActions,
  renderEventListeners,
  resize,
  saveState,
} = workerViewlet

// Preview worker notifications do not identify one viewlet: editor changes may update
// several previews, including tabs that are not selected.
const rerenderAll = async () => {
  for (const uid of instances) {
    await PreviewWorker.invoke('Preview.rerender', uid)
    await Viewlet.requestRender(uid)
  }
}
rerenderAll.requiresInstance = false

export const getCommands = async () => {
  const commands = await workerViewlet.getCommands()
  commands.rerender = rerenderAll
  return commands
}

export const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(_oldState, newState) {
    return newState.title
  },
}

export const loadContent = async (state, ...args) => {
  const { uid } = state
  instances.add(uid)
  try {
    const result = await loadWorkerContent(state, ...args)
    await updateOutputChannelState()
    return result
  } catch (error) {
    instances.delete(uid)
    await updateOutputChannelState()
    if (instances.size === 0) await PreviewSandBoxWorker.dispose()
    throw error
  }
}

export const dispose = async (state) => {
  const { uid } = state
  await disposeWorkerViewlet(state)
  instances.delete(uid)
  await updateOutputChannelState()
  if (instances.size === 0) await PreviewSandBoxWorker.dispose()
}
