import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as PreviewSandBoxWorker from '../PreviewSandBoxWorker/PreviewSandBoxWorker.js'

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
} = createWorkerViewlet({ workerId: 'preview' })

export const dispose = PreviewSandBoxWorker.dispose
