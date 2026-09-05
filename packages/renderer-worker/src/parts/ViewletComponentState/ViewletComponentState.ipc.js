import * as ComponentStateSubscription from '../ComponentStateSubscription/ComponentStateSubscription.ts'
import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'

const workerViewlet = createWorkerViewlet({ workerId: 'componentState' })

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  getCommands,
  getKeyBindings,
  getMenus,
  getTitle,
  hasDirectRender,
  hasFunctionalEvents,
  hasFunctionalRender,
  hasFunctionalResize,
  hasFunctionalRootRender,
  loadContent,
  menus,
  name,
  render,
  renderEventListeners,
  renderTitle,
  resize,
  saveState,
} = workerViewlet

export const serializeCommands = true

Commands.loadContentLater = (state) => ComponentStateSubscription.subscribe(state.uid)

export const dispose = (state) => {
  ComponentStateSubscription.unsubscribe(state.uid)
  return workerViewlet.dispose(state)
}
