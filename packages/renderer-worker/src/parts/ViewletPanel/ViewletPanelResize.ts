import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const resize = async (state, dimensions) => {
  const currentViewletInstance = ViewletStates.getInstance(state.currentViewletId)
  const newState = {
    ...state,
    ...dimensions,
  }
  if (!currentViewletInstance) {
    return {
      newState,
      commands: [],
    }
  }
  const currentViewletUid = currentViewletInstance.state.uid
  const commands = await Viewlet.resize(currentViewletUid, dimensions)
  return {
    newState,
    commands,
  }
}
