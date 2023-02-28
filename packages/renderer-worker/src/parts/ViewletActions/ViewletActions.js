import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getActions = (id) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    return []
  }
  const state = instance.state
  const factory = instance.factory
  if (!factory.getActions) {
    return []
  }
  return factory.getActions(state)
}
