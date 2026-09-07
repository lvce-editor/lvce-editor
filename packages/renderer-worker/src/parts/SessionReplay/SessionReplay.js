import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Command from '../Command/Command.js'
import * as GetSessionId from '../GetSessionId/GetSessionId.js'
import * as Location from '../Location/Location.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Product from '../Product/Product.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const state = { authState: undefined, configuration: '', pending: Promise.resolve() }

export const startRecording = async (authState) => {
  const local = Preferences.get('sessionReplay.enabled') === true
  const upload = Preferences.get('sessionReplay.uploadEnabled') === true
  if (!state.configuration && !local && !upload) return
  const backendUrl = Preferences.get('layout.backendUrl') || Product.getBackendUrl()
  const endpoint = new URL('/session-replay', backendUrl || 'https://lvce-editor.dev')
  const href = await Location.getHref()
  if (new URL(href).searchParams.get('allowAnonymous') === 'true') endpoint.searchParams.set('allowAnonymous', 'true')
  const options = { local, upload, endpoint: endpoint.href, token: authState?.token || authState?.accessToken || '' }
  const configuration = JSON.stringify(options)
  if (configuration === state.configuration) return
  const id = await RendererProcess.invoke('SessionReplay.configure', options)
  state.configuration = configuration
  GetSessionId.state.sessionId = id
}

export const getSessionContent = async () => JSON.stringify(await RendererProcess.invoke('SessionReplay.getSession'))

export const downloadSession = async () => {
  const session = await RendererProcess.invoke('SessionReplay.getSession')
  await Command.execute('Download.downloadJson', session, `${session.id}.json`)
}

export const replaySession = async (sessionId) => {
  const url = new URL(await Location.getHref())
  url.search = ''
  url.hash = ''
  url.searchParams.set('replayId', sessionId)
  await Command.execute('Open.openUrl', url.href)
}

export const replayCurrentSession = async () => {
  const sessionId = GetSessionId.state.sessionId
  if (!sessionId || !Preferences.get('sessionReplay.enabled')) throw new Error('Enable local session replay in settings first')
  await replaySession(sessionId)
}

export const openSession = async () => {
  const url = new URL(await Location.getHref())
  url.search = '?sessionReplay=true'
  url.hash = ''
  await Command.execute('Open.openUrl', url.href)
}

const handlePreferencesChanged = () => {
  state.pending = state.pending.catch(() => {}).then(() => startRecording(state.authState))
  return state.pending
}

export const initialize = async (authState) => {
  state.authState = authState
  GlobalEventBus.addListener('preferences.changed', handlePreferencesChanged)
  await handlePreferencesChanged()
}
