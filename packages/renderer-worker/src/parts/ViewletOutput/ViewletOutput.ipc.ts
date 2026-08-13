import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, focus, getCommands, getKeyBindings, getMenus, getQuickPickMenuEntries,
  getStorageKey, getTitle, hasDirectRender, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderDialog, renderEventListeners, renderTitle, resize, saveState,
} = createWorkerViewlet({ workerId: 'output' })
