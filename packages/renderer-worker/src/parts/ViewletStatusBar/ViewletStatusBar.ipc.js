import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  dispose,
  getCommands,
  getKeyBindings,
  hasFunctionalEvents,
  hasFunctionalRender,
  hasFunctionalResize,
  hasFunctionalRootRender,
  hotReload,
  loadContent,
  name,
  render,
  renderEventListeners,
  resize,
  saveState,
} = createWorkerViewlet({ workerId: 'statusBar' })

export * from './ViewletStatusBarMenuEntries.js'
