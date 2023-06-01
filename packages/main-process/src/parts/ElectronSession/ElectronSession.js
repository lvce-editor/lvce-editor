const Electron = require('electron')
const Platform = require('../Platform/Platform.js')
const Protocol = require('../Protocol/Protocol.js')
const HandleHeadersReceived = require('../HandleHeadersReceived/HandleHeadersReceived.js')
const HandlePermission = require('../HandlePermission/HandlePermission.js')
const HandleRequest = require('../HandleRequest/HandleRequest.js')
const ElectronProtocolType = require('../ElectronProtocolType/ElectronProtocolType.js')

const createSession = () => {
  const sessionId = Platform.getSessionId()
  const session = Electron.session.fromPartition(sessionId, {
    cache: Platform.isProduction,
  })
  session.webRequest.onHeadersReceived(HandleHeadersReceived.handleHeadersReceived)
  session.setPermissionRequestHandler(HandlePermission.handlePermissionRequest)
  session.setPermissionCheckHandler(HandlePermission.handlePermissionCheck)
  Protocol.handle(session.protocol, Platform.scheme, ElectronProtocolType.File, HandleRequest.handleRequest)
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
