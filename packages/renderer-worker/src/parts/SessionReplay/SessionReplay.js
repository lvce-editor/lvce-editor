import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as GetSessionEvents from '../GetSessionEvents/GetSessionEvents.js'
import * as GetSessionId from '../GetSessionId/GetSessionId.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Json from '../Json/Json.js'
import * as Location from '../Location/Location.js'
import * as Promises from '../Promises/Promises.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SessionReplayStorage from '../SessionReplayStorage/SessionReplayStorage.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'
import * as Timeout from '../Timeout/Timeout.js'
import * as Timestamp from '../Timestamp/Timestamp.js'
import { VError } from '../VError/VError.js'

export const getEvents = GetSessionEvents.getSessionEvents

export const handleMessage = async (source, timestamp, message) => {
  try {
    const sessionId = GetSessionId.getSessionId()
    await SessionReplayStorage.saveValue(sessionId, {
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
    throw new VError('session replay is disabled in settings')
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
  const events = await GetSessionEvents.getSessionEvents(sessionId)
  return Json.stringify(events)
}

const DONT_REPLAY = new Set(['Open.openUrl', 'Download.downloadFile'])

export const replaySession = async (sessionId) => {
  const events = await GetSessionEvents.getSessionEvents(sessionId)
  const originalIpc = RendererProcess.state.rpc.ipc
  HandleIpc.unhandleIpc(originalIpc)
  const originalSend = originalIpc.send.bind(originalIpc)
  const originalAddEventListsner = originalIpc.addEventListener.bind(originalIpc)
  const wrappedSend = () => {}
  const wrappedOnMessage = async (event) => {
    const { data } = event
    if ('result' in data || 'error' in data) {
      callbacks[data.id](data)
      delete callbacks[data.id]
    } else if ('method' in data) {
      switch (data.method) {
        case 'TitleBar.handleTitleBarButtonClickClose':
          RendererProcess.state.rpc.ipc.onmessage = originalAddEventListsner
          RendererProcess.state.rpc.ipc.send = originalSend
          await Command.execute('ElectronWindow.close')
          RendererProcess.state.rpc.ipc.onmessage = wrappedOnMessage
          RendererProcess.state.rpc.ipc.send = wrappedSend
          break
        case 'TitleBar.handleTitleBarButtonClickMinimize':
          RendererProcess.state.rpc.ipc.onmessage = originalAddEventListsner
          RendererProcess.state.rpc.ipc.send = originalSend
          await Command.execute('ElectronWindow.minimize')
          RendererProcess.state.rpc.ipc.onmessage = wrappedOnMessage
          RendererProcess.state.rpc.ipc.send = wrappedSend
          break
        case 'TitleBar.handleTitleBarButtonClickToggleMaximize':
          RendererProcess.state.rpc.ipc.onmessage = originalAddEventListsner
          RendererProcess.state.rpc.ipc.send = originalSend
          await Command.execute('ElectronWindow.maximize')
          RendererProcess.state.rpc.ipc.onmessage = wrappedOnMessage
          RendererProcess.state.rpc.ipc.send = wrappedSend
          break
        default:
          break
      }
    } else {
      throw new Error('unexpected message from renderer worker')
    }
  }
  RendererProcess.state.rpc.send = wrappedSend
  RendererProcess.state.rpc.addEventListener('message', wrappedOnMessage)
  const callbacks = Object.create(null)
  const invoke = (event) => {
    const { resolve, promise } = Promises.withResolvers()
    callbacks[event.id] = resolve
    originalSend(event)
    return promise
  }
  let now = 0
  for (const event of events) {
    if (event.source === 'to-renderer-process' && !DONT_REPLAY.has(event.method)) {
      // console.log(event.timestamp)
      const timeDifference = event.timestamp - now
      await Timeout.sleep(timeDifference)
      await invoke(event)
      now = event.timestamp
    }
    // if (event.source === 'from-renderer-process') {
    //   console.log(event)
    // }
  }
  // console.log({ events })
}

export const downloadSession = async () => {
  try {
    const sessionId = GetSessionId.getSessionId()
    const events = await GetSessionEvents.getSessionEvents(sessionId)
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
  // TODO use addeventlistener
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
  RendererProcess.state.rpc.ipc = wrapIpc(RendererProcess.state.rpc, 'renderer-process', (event) => event.data)
  SharedProcessState.state.ipc = wrapIpc(SharedProcessState.state.ipc, 'shared-process', (event) => event)
}

export const openSession = async () => {
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ 'app://session.json')
}
