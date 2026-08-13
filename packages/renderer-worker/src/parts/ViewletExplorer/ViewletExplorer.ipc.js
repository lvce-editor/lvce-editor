import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, getCommands, getDisplayName, getKeyBindings, getMenus, getMouseActions,
  getQuickPickMenuEntries, getStorageKey, getTitle, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize,
  hasDirectRender, hasFunctionalRootRender, hotReload, loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize,
  resizeWithDependencies, restoreState, saveState,
} = createWorkerViewlet({ workerId: 'explorer' })
