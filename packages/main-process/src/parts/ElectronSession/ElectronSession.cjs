const Electron = require('electron')
const HandleHeadersReceived = require('../HandleHeadersReceived/HandleHeadersReceived.cjs')
const HandlePermission = require('../HandlePermission/HandlePermission.cjs')
const HandleRequest = require('../HandleRequest/HandleRequest.cjs')
const IsSessionCacheEnabled = require('../IsSessionCacheEnabled/IsSessionCacheEnabled.cjs')
const Platform = require('../Platform/Platform.cjs')
const Protocol = require('../Protocol/Protocol.cjs')

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

const state = {
  /**
   * @type {any}
   */
  session: undefined,
}

exports.state = state

exports.get = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}
