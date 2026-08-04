import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  ActivityBar, Commands, Css, Events, Variables, create, dispose, getCommands, getDisplayName, getKeyBindings, getMenus, getQuickPickMenuEntries,
  getStorageKey, getTitle, hasFunctionalEvents, hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload,
  loadContent, menus, name, render, renderActions, renderEventListeners, renderTitle, resize, saveState,
} = createWorkerViewlet({ workerId: 'activityBar' })
