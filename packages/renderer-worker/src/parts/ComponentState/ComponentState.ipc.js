import * as ComponentState from './ComponentState.js'

export const name = 'ComponentState'

export const Commands = {
  getComponents: ComponentState.getComponents,
  getDom: ComponentState.getDom,
  getSavedState: ComponentState.getSavedState,
  getState: ComponentState.getState,
  getWorkerName: ComponentState.getWorkerName,
  setDom: ComponentState.setDom,
  setState: ComponentState.setState,
}
