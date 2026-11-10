import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

const viewlet = createWorkerViewlet({ workerId: 'aboutWorker' })

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  getCommands,
  getKeyBindings,
  hasDirectRender,
  hasFunctionalEvents,
  hasFunctionalRender,
  hasFunctionalResize,
  hasFunctionalRootRender,
  hotReload,
  loadContent,
  menus,
  name,
  render,
  renderDialog,
  renderEventListeners,
  resize,
  saveState,
} = viewlet

export const dispose = async (...args: Parameters<typeof viewlet.dispose>) => {
  await viewlet.dispose?.(...args)
  await AboutViewWorker.dispose()
}
