import * as MoreActions from './ViewletExtensionsMoreActions.js'
import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

const workerViewlet = createWorkerViewlet({ workerId: 'extensionSearch' })

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  dispose,
  focus,
  getComponentDom,
  getComponentState,
  getKeyBindings,
  getMenus,
  getQuickPickMenuEntries,
  getStorageKey,
  getTitle,
  handleExtensionsChanged,
  hasDirectRender,
  hasFunctionalEvents,
  hasFunctionalRender,
  hasFunctionalResize,
  hasFunctionalRootRender,
  hotReload,
  loadContent,
  name,
  render,
  renderActions,
  renderTitle,
  resize,
  saveState,
  setComponentState,
} = workerViewlet

export const menus = [MoreActions]

export const getCommands = async () => {
  const commands = await workerViewlet.getCommands()
  commands.showMoreActions = MoreActions.showMoreActions
  return commands
}

export const renderEventListeners = async () => [...(await workerViewlet.renderEventListeners()), MoreActions.eventListener]
