import * as CreateSessionId from '../CreateSessionId/CreateSessionId.js'

export const state = {
  sessionId: '',
}

export const getSessionId = () => {
  state.sessionId ||= CreateSessionId.creareSessionId()
  return state.sessionId
}
