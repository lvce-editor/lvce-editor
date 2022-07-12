import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const listen = async () => {
  await SharedProcess.invoke(/* ExtensionHost.start */ 'ExtensionHost.start')
  let _onmessage
  return {
    get onmessage() {
      return _onmessage
    },
    set onmessage(listener) {
      _onmessage = listener
      // TODO actually set listener
    },
    dispose() {},
    send(message) {
      // TODO
    },
  }
}
