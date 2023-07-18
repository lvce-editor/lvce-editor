import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as GetSessionId from '../GetSessionId/GetSessionId.js'
import * as IndexedDb from '../IndexedDb/IndexedDb.js'
import * as Json from '../Json/Json.js'
import * as Location from '../Location/Location.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Timestamp from '../Timestamp/Timestamp.js'
import { VError } from '../VError/VError.js'

export const handleMessage = async (source, timestamp, message) => {
  try {
    const sessionId = GetSessionId.getSessionId()
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

const addSearchParam = (href, key, value) => {
  const parsedUrl = new URL(href)
  parsedUrl.searchParams.set('replayId', GetSessionId.getSessionId())
  return parsedUrl.toString()
}

export const replayCurrentSession = async () => {
  if (!GetSessionId.state.sessionId) {
    throw new VError(`session replay is disabled in settings`)
  }
  // TODO
  // 1. read commands from indexeddb
  // 2. open new window
  // 3. replay ui with commands from indexeddb

  const href = await Location.getHref()
  const replayUrl = addSearchParam(href, 'replayId', GetSessionId.getSessionId())
  await Command.execute('Open.openUrl', /* url */ replayUrl)
}

export const getSessionContent = async () => {
  const sessionId = GetSessionId.getSessionId()
  const events = await getEvents(sessionId)
  return Json.stringify(events)
}

const DONT_REPLAY = new Set(['Open.openUrl', 'Download.downloadFile'])

export const replaySession = async (sessionId) => {
  const events = await getEvents(sessionId)
  const originalIpc = RendererProcess.state.ipc
  const originalSend = originalIpc.send.bind(originalIpc)
  const originalOnMessage = originalIpc.onmessage.bind(originalIpc)
  const wrappedSend = () => {}
  const wrappedOnMessage = async (data) => {
    if (typeof data === 'string') {
      return
    }
    if ('result' in data) {
      callbacks[data.id].resolve(data.result)
    } else if ('error' in data) {
      callbacks[data.id].reject(data.error)
    } else if ('method' in data) {
      switch (data.method) {
        case 'TitleBar.handleTitleBarButtonClickClose':
          RendererProcess.state.ipc.onmessage = originalOnMessage
          RendererProcess.state.ipc.send = originalSend
          await Command.execute('ElectronWindow.close')
          RendererProcess.state.ipc.onmessage = wrappedOnMessage
          RendererProcess.state.ipc.send = wrappedSend
          break
        case 'TitleBar.handleTitleBarButtonClickMinimize':
          RendererProcess.state.ipc.onmessage = originalOnMessage
          RendererProcess.state.ipc.send = originalSend
          await Command.execute('ElectronWindow.minimize')
          RendererProcess.state.ipc.onmessage = wrappedOnMessage
          RendererProcess.state.ipc.send = wrappedSend
          break
        case 'TitleBar.handleTitleBarButtonClickToggleMaximize':
          RendererProcess.state.ipc.onmessage = originalOnMessage
          RendererProcess.state.ipc.send = originalSend
          await Command.execute('ElectronWindow.maximize')
          RendererProcess.state.ipc.onmessage = wrappedOnMessage
          RendererProcess.state.ipc.send = wrappedSend
          break
        default:
          break
      }
    } else {
      throw new Error('unexpected message from renderer worker')
    }
  }
  RendererProcess.state.ipc.send = wrappedSend
  RendererProcess.state.ipc.onmessage = wrappedOnMessage
  const callbacks = Object.create(null)
  const invoke = (event) => {
    return new Promise((resolve, reject) => {
      callbacks[event.id] = { resolve, reject }
      originalSend(event)
    })
  }
  let now = 0
  for (const event of events) {
    if (event.source === 'to-renderer-process' && !DONT_REPLAY.has(event.method)) {
      // console.log(event.timestamp)
      const timeDifference = event.timestamp - now
      await new Promise((resolve, reject) => {
        setTimeout(resolve, timeDifference)
      })
      await invoke(event)
      now = event.timestamp
    }
    // if (event.source === 'from-renderer-process') {
    //   console.log(event)
    // }
  }
  // console.log({ events })
}

export const getEvents = async (sessionId) => {
  try {
    const timestamp = Timestamp.now()
    const events = await IndexedDb.getValuesByIndexName('session', 'sessionId', sessionId)
    return events
  } catch (error) {
    throw new VError(error, `failed to get session replay events`)
  }
}

export const downloadSession = async () => {
  try {
    const sessionId = GetSessionId.getSessionId()
    const events = await getEvents(sessionId)
    const fileName = `${sessionId}.json`
    await Command.execute(/* Download.downloadJson */ 'Download.downloadJson', /* json */ events, /* fileName */ fileName)
  } catch (error) {
    throw new VError(error, 'Failed to download session')
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
      const timestamp = Timestamp.now()
      await handleMessage(nameTo, timestamp, message)
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
    const timestamp = Timestamp.now()
    await originalOnMessage(event)
    await handleMessage(nameFrom, timestamp, message)
  }
  return wrappedIpc
}

export const startRecording = () => {
  RendererProcess.state.ipc = wrapIpc(RendererProcess.state.ipc, 'renderer-process', (event) => event.data)
  SharedProcess.state.ipc = wrapIpc(SharedProcess.state.ipc, 'shared-process', (event) => event)
}

export const openSession = async () => {
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ 'app://session.json')
}
