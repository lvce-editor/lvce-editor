import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as Platform from '../Platform/Platform.js'
import * as ProcessExplorerPreferences from '../ProcessExplorerPreferences/ProcessExplorerPreferences.js'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'

const getPlatform = Platform.getPlatform

const workerViewlet = createWorkerViewlet({ workerId: 'processExplorer', getPlatform })

export const {
  Commands,
  Css,
  Events: workerEvents,
  Variables,
  create,
  dispose,
  getCommands,
  getComponentDom,
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
} = workerViewlet

export const handlePreferencesChanged = async (state) => {
  const { processExplorerUpdateInterval: previousUpdateInterval, uid } = state
  const updateInterval = ProcessExplorerPreferences.getUpdateInterval()
  if (updateInterval === previousUpdateInterval) {
    return state
  }
  await ProcessExplorerWorker.invoke('ProcessExplorer.setUpdateInterval', uid, updateInterval)
  return { ...state, processExplorerUpdateInterval: updateInterval }
}

export const Events = {
  ...workerEvents,
  'preferences.changed': handlePreferencesChanged,
}
