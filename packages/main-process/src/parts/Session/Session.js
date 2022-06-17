const Electron = require('electron')
const Platform = require('../Platform/Platform.js')

exports.state = {
  /**
   * @type {import('electron').Session|undefined}
   */
  session: undefined,
}

exports.get = () => {
  if (!exports.state.session) {
    const sessionId = Platform.getSessionId()
    exports.state.session = Electron.session.fromPartition(sessionId, {
      cache: Platform.isProduction(),
    })
  }
  return exports.state.session
}
