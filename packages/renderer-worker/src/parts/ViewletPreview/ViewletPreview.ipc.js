import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as PreviewSandBoxWorker from '../PreviewSandBoxWorker/PreviewSandBoxWorker.js'

const workerViewlet = createWorkerViewlet({ workerId: 'preview' })
const { dispose: disposeWorkerViewlet } = workerViewlet

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
  loadContent,
  menus,
  name,
  render,
  renderActions,
  renderEventListeners,
  renderTitle,
  resize,
  saveState,
} = workerViewlet

export const dispose = async (state) => {
  await disposeWorkerViewlet(state)
  await PreviewSandBoxWorker.dispose()
}
