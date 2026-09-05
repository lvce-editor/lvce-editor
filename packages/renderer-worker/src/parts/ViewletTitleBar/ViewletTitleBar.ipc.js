import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, getCommands, getKeyBindings, getMenus, getQuickPickMenuEntries, getStorageKey,
  getComponentDom, getComponentState, getTitle, handleFocusChange, hasDirectRender, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize, saveState, setComponentState,
} = createWorkerViewlet({ workerId: 'titleBar' })
