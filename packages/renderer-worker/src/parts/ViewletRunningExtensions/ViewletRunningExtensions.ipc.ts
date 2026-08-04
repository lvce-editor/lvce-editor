import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, getCommands, getKeyBindings, getMenus, getTitle, handleExtensionsChanged, hasFunctionalEvents,
  hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload, loadContent, menus, name, render, renderEventListeners,
  renderTitle, resize, saveState,
} = createWorkerViewlet({ workerId: 'runningExtensionsView' })
