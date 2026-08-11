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
