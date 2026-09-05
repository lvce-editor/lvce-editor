import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

const getPlatform = () => {
  const platform = Platform.getPlatform()
  if (platform === PlatformType.Electron) {
    return platform
  }
  return WorkspaceConnection.isActive() ? PlatformType.Remote : platform
}

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
