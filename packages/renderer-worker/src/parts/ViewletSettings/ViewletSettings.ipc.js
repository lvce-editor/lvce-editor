import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, focus, getCommands, getKeyBindings, getMenus, getQuickPickMenuEntries,
  getComponentState, getStorageKey, getTitle, hasDirectRender, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize, saveState, setComponentState,
} = createWorkerViewlet({ workerId: 'settingsView' })
