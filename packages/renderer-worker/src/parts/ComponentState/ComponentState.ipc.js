import * as ComponentState from './ComponentState.js'

export const name = 'ComponentState'

export const Commands = {
  getComponents: ComponentState.getComponents,
  getState: ComponentState.getState,
  setState: ComponentState.setState,
}
