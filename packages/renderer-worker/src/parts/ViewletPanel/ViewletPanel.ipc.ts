import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as Command from '../Command/Command.js'

export const contentLoadedEffects = async (): Promise<void> => {
  await Command.execute('Layout.refreshProblemsSummary')
}

export const {
  Commands,
  Css,
  Events,
  Variables,
  create,
  dispose,
  getCommands,
  getComponentState,
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
  renderEventListeners,
  resize,
  saveState,
  setComponentState,
  workspaceChangeEvent,
} = createWorkerViewlet({ workerId: 'panel' })
