import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands, Css, Events, Variables, create, dispose, getCommands, getKeyBindings, getMenus, getTitle, hasFunctionalEvents,
  hasFunctionalRender, hasFunctionalResize, hasFunctionalRootRender, hotReload, loadContent, menus, name, render, renderDialog, renderEventListeners,
  renderTitle, resize, saveState,
} = createWorkerViewlet({ workerId: 'languageModels' })
