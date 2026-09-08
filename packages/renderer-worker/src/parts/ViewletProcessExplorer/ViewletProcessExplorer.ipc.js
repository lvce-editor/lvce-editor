import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as Platform from '../Platform/Platform.js'

const getPlatform = Platform.getPlatform

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  dispose,
  getCommands,
  getComponentState,
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
  loadContent,
  menus,
  name,
  render,
  renderActions,
  renderEventListeners,
  renderTitle,
  resize,
  saveState,
  setComponentState,
} = createWorkerViewlet({ workerId: 'processExplorer', getPlatform })
