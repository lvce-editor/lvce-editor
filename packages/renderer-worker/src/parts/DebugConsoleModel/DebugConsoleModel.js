import * as Debug from '../Debug/Debug.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const formatResult = (result) => {
  if (!result) {
    return result
  }
  if (typeof result === 'string') {
    return result
  }
  return result.description
}

export const evaluate = async (inputValue) => {
  // TODO don't depend on other component state
  const debugState = ViewletStates.getState(ViewletModuleId.RunAndDebug)
  if (!debugState) {
    return ''
  }
  const { debugId, callFrameId } = debugState
  const result = await Debug.evaluate(debugId, inputValue, callFrameId)
  const preview = formatResult(result)
  return preview
}
