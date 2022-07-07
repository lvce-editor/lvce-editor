import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as IndexedDb from '../IndexedDb/IndexedDb.js'
import * as Location from '../Location/Location.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Assert from '../Assert/Assert.js'

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
    // @ts-ignore
    if (error.cause) {
      // @ts-ignore
      console.error(error.cause)
    }
    // await ErrorHandling.handleError(error)
  }
}

export const replayCurrentSession = async () => {
  console.log('replay session')
  // TODO
  // 1. read commands from indexeddb
  // 2. open new window
  // 3. replay ui with commands from indexeddb

  const href = await Location.getHref()
  const replayUrl = `${href}?replayId=${state.sessionId}`
  await Command.execute('Open.openUrl', /* url */ replayUrl)
}

export const replaySession = async (sessionId) => {
  const events = await getEvents(sessionId)
  const originalIpc = RendererProcess.state.ipc
  const originalSend = originalIpc.send
  RendererProcess.state.ipc.send = () => {}
  RendererProcess.state.ipc.onmessage = (event) => {
    const data = event.data
    if ('result' in data) {
      callbacks[data.id].resolve(data.result)
    } else if ('error' in data) {
      callbacks[data.id].reject(data.error)
    } else {
      throw new Error('unexpected message')
    }
  }
  const callbacks = Object.create(null)
  const invoke = (event) => {
    return new Promise((resolve, reject) => {
      callbacks[event.id] = { resolve, reject }
      originalSend(event)
    })
  }
  let now = 0
  for (const event of events) {
    if (event.source === 'to-renderer-process') {
      if (event.method !== 'Open.openUrl') {
        // console.log(event.timestamp)
        const timeDifference = event.timestamp - now
        await new Promise((resolve, reject) => {
          setTimeout(resolve, timeDifference)
        })
        await invoke(event)
        now = event.timestamp
      }
    }
    if (event.source === 'from-renderer-process') {
      console.log(event)
    }
  }
  // console.log({ events })
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

const wrapIpc = (ipc, name, getData) => {
  if (!ipc) {
    return
  }
  Assert.object(ipc)
  Assert.string(name)
  Assert.fn(getData)
  const nameFrom = `from-${name}`
  const nameTo = `to-${name}`
  const wrappedIpc = {
    async send(message) {
      ipc.send(message)
      await handleMessage(nameTo, message)
    },
    sendAndTransfer(message, transferables) {
      ipc.sendAndTransfer(message, transferables)
    },
    get onmessage() {
      return ipc.onmessage
    },
    set onmessage(listener) {
      ipc.onmessage = listener
    },
  }
  const originalOnMessage = wrappedIpc.onmessage
  wrappedIpc.onmessage = async (event) => {
    const message = getData(event)
    await originalOnMessage(event)
    await handleMessage(nameFrom, message)
  }
  return wrappedIpc
}

export const startRecording = () => {
  RendererProcess.state.ipc = wrapIpc(
    RendererProcess.state.ipc,
    'renderer-process',
    (event) => event.data
  )
  SharedProcess.state.ipc = wrapIpc(
    SharedProcess.state.ipc,
    'shared-process',
    (event) => event
  )
}
