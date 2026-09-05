import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, getBadgeCount, getCommands, getComponentState, getKeyBindings, getMenus, getQuickPickMenuEntries,
  getStorageKey, getTitle, hasDirectRender, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize, resizeWithDependencies, saveState, setComponentState,
} = createWorkerViewlet({ workerId: 'problemsViewWorker' })
