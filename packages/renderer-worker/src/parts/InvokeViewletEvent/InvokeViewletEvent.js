import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const invokeViewletEvent = async (moduleId, instance, handler, ...params) => {
  try {
    const newState = await handler(instance.state, ...params)
    if (ViewletStates.getInstance(moduleId) !== instance) {
      return undefined
    }
    if (!newState) {
      throw new Error('newState must be defined')
    }
    return newState
  } catch (error) {
    if (ViewletStates.getInstance(moduleId) === instance) {
      throw error
    }
    return undefined
  }
}
