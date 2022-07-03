import * as IndexedDb from '../IndexedDb/IndexedDb.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'

export const state = {
  sessionId: '',
}

const getSessionId = () => {
  if (!state.sessionId) {
    state.sessionId = `session-${new Date()}`.replaceAll(' ', '-')
  }
  return state.sessionId
}

export const handleMessage = async (source, message) => {
  try {
    const sessionId = getSessionId()
    const timestamp = performance.now()
    // console.log({ message, timestamp })
    await IndexedDb.saveValue(sessionId, { source, ...message })
  } catch (error) {
    console.error(error)
    if (error.cause) {
      console.error(error.cause)
    }
    // await ErrorHandling.handleError(error)
  }
}

export const replaySession = async () => {
  console.log('replay session')
  // TODO
  // 1. read commands from indexeddb
  // 2. open new window
  // 3. replay ui with commands from indexeddb

  const replayUrl = `${location.href}?replayId=${state.sessionId}`
  console.log({ replayUrl })
  const newWindow = open(replayUrl)
}

export const getEvents = async (sessionId) => {
  try {
    const sessionId = getSessionId()
    const timestamp = performance.now()
    // console.log({ message, timestamp })
    await IndexedDb.getValues(sessionId)
  } catch (error) {
    ErrorHandling.handleError(error)
    // console.info(`failed to get events from indexeddb: ${error}`)
    // ignore
    return []
  }
}
