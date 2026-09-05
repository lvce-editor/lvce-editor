import * as ComponentState from './ComponentState.js'

export const name = 'ComponentState'

export const Commands = {
  getComponents: ComponentState.getComponents,
  getDom: ComponentState.getDom,
  getState: ComponentState.getState,
  setState: ComponentState.setState,
}
