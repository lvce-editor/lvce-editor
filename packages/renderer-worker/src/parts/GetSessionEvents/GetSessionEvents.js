import * as SessionReplayStorage from '../SessionReplayStorage/SessionReplayStorage.js'
import { VError } from '../VError/VError.js'

export const getSessionEvents = async (sessionId) => {
  try {
    const events = await SessionReplayStorage.getValuesByIndexName('session', 'sessionId', sessionId)
    return events
  } catch (error) {
    throw new VError(error, 'failed to get session replay events')
  }
}
