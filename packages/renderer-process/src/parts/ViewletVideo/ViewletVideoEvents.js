import * as ViewletVideoFunctions from './ViewletVideoFunctions.js'

export const handleVideoError = (event) => {
  const { target } = event
  const { error } = target
  const { code, message } = error
  ViewletVideoFunctions.handleVideoError(code, message)
}
