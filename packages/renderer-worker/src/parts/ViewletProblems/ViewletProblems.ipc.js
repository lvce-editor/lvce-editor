import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, getBadgeCount, getCommands, getKeyBindings, getMenus, getQuickPickMenuEntries,
  getStorageKey, getTitle, hasDirectRender, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize, resizeWithDependencies, saveState,
} = createWorkerViewlet({ workerId: 'problemsViewWorker' })
