import * as ComponentState from './ComponentState.js'

export const name = 'ComponentState'

export const Commands = {
  getComponents: ComponentState.getComponents,
  getDom: ComponentState.getDom,
  getState: ComponentState.getState,
  setDom: ComponentState.setDom,
  setState: ComponentState.setState,
}
