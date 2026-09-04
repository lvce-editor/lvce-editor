import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, focus, getCommands, getComponentState, getKeyBindings, getMenus, getQuickPickMenuEntries,
  getStorageKey, getTitle, handleExtensionsChanged, hasDirectRender, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize, saveState, setComponentState,
} = createWorkerViewlet({ workerId: 'extensionSearch' })
