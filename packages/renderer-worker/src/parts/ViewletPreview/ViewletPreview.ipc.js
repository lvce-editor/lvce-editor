import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as PreviewSandBoxWorker from '../PreviewSandBoxWorker/PreviewSandBoxWorker.js'

const workerViewlet = createWorkerViewlet({ workerId: 'preview' })
const { dispose: disposeWorkerViewlet, loadContent: loadWorkerContent } = workerViewlet
const instances = new Set()

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
  instances.add(state.uid)
  try {
    return await loadWorkerContent(state, ...args)
  } catch (error) {
    instances.delete(state.uid)
    if (instances.size === 0) await PreviewSandBoxWorker.dispose()
    throw error
  }
}

export const dispose = async (state) => {
  await disposeWorkerViewlet(state)
  instances.delete(state.uid)
  if (instances.size === 0) await PreviewSandBoxWorker.dispose()
}
