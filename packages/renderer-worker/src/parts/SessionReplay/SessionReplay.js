import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as IndexedDb from '../IndexedDb/IndexedDb.js'

export const state = {
  sessionId: '',
}

const getSessionId = () => {
  if (!state.sessionId) {
    state.sessionId = `session-${new Date().toISOString()}`
  }
  return state.sessionId
}

export const handleMessage = async (source, message) => {
  try {
    const sessionId = getSessionId()
    const timestamp = performance.now()
    // console.log({ message, timestamp })
    await IndexedDb.saveValue(sessionId, {
      source,
      timestamp,
      sessionId,
      ...message,
    })
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

  // console.log({ replayUrl })
  const newWindow = open(replayUrl)
}

export const getEvents = async (sessionId) => {
  try {
    const timestamp = performance.now()
    // console.log({ message, timestamp })
    const events = await IndexedDb.getValues('session')
    const matchesSessionId = (event) => {
      return event.sessionId === sessionId
    }
    const filteredEvents = events.filter(matchesSessionId)
    return filteredEvents
  } catch (error) {
    ErrorHandling.handleError(error)
    // console.info(`failed to get events from indexeddb: ${error}`)
    // ignore
    return []
  }
}

export const downloadSession = async () => {
  let url = ''
  try {
    const sessionId = getSessionId()
    const events = await getEvents(sessionId)
    const stringifiedEvents = JSON.stringify(events, null, 2)
    const blob = new Blob([stringifiedEvents], {
      type: 'application/json',
    })
    const fileName = `${sessionId}.json`
    url = URL.createObjectURL(blob)
    await Command.execute(
      /* Download.downloadFile */ 'Download.downloadFile',
      /* fileName */ fileName,
      /* url */ url
    )
  } catch (error) {
    throw new Error('Failed to download session', {
      // @ts-ignore
      cause: error,
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
