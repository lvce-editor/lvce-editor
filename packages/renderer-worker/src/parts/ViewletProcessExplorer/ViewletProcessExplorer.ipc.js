import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as WorkspaceBackend from '../WorkspaceBackend/WorkspaceBackend.js'

const getPlatform = () => (WorkspaceBackend.isActive() ? PlatformType.Remote : Platform.getPlatform())

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  dispose,
  getCommands,
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
} = createWorkerViewlet({ workerId: 'processExplorer', getPlatform })
