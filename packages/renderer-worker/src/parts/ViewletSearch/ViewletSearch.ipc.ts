import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, create, Css, dispose, Events, focus, getCommands, getComponentDom, getComponentState, getKeyBindings, getMenus, getQuickPickMenuEntries, getStorageKey,
  getTitle, hasDirectRender, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload, loadContent,
  menus, name, render, renderActions, renderEventListeners, renderTitle, resize, saveState, setComponentState, Variables, wrapTextSearchCommand,
} = createWorkerViewlet({ workerId: 'textSearchView' })
