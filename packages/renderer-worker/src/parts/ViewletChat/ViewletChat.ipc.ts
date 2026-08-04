import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, focus, getCommands, getKeyBindings, getMenus, getQuickPickMenuEntries,
  getStorageKey, getTitle, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize, saveState,
} = createWorkerViewlet({ workerId: 'chatView' })
