import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'
import * as PreviewSandBoxWorker from '../PreviewSandBoxWorker/PreviewSandBoxWorker.js'

const workerViewlet = createWorkerViewlet({ workerId: 'preview' })
const { dispose: disposeWorkerViewlet, loadContent: loadWorkerContent } = workerViewlet
const instances = new Set()
let outputChannelActive = false

const updateOutputChannelState = async () => {
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
  getCommands,
  getKeyBindings,
  getMenus,
  getQuickPickMenuEntries,
  getStorageKey,
  getTitle,
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
  renderTitle,
  resize,
  saveState,
} = workerViewlet

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
