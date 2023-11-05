import * as Electron from 'electron'
import * as HandleHeadersReceived from '../HandleHeadersReceived/HandleHeadersReceived.js'
import * as HandlePermission from '../HandlePermission/HandlePermission.js'
import * as HandleRequest from '../HandleRequest/HandleRequest.js'
import * as IsSessionCacheEnabled from '../IsSessionCacheEnabled/IsSessionCacheEnabled.js'
import * as Platform from '../Platform/Platform.js'
import * as Protocol from '../Protocol/Protocol.js'

const createSession = () => {
  const sessionId = Platform.getSessionId()
  const session = Electron.session.fromPartition(sessionId, {
    cache: IsSessionCacheEnabled.isSessionCacheEnabled,
  })
  session.webRequest.onHeadersReceived(HandleHeadersReceived.handleHeadersReceived)
  session.setPermissionRequestHandler(HandlePermission.handlePermissionRequest)
  session.setPermissionCheckHandler(HandlePermission.handlePermissionCheck)
  Protocol.handle(session.protocol, Platform.scheme, HandleRequest.handleRequest)
  return session
}

export const state = {
  /**
   * @type {any}
   */
  session: undefined,
}

export const get = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}
