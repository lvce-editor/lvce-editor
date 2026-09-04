import { createWorkerViewlet } from '../CreateWorkerViewlet/CreateWorkerViewlet.js'
import * as Command from '../Command/Command.js'

export const contentLoadedEffects = async () => {
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
  name,
  render,
  renderEventListeners,
  resize,
  saveState,
  setComponentState,
} = createWorkerViewlet({ workerId: 'statusBar' })

export * from './ViewletStatusBarMenuEntries.js'
