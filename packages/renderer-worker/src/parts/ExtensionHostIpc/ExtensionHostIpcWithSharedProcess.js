import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const listen = async () => {
  const id = await SharedProcess.invoke(
    /* ExtensionHost.start */ 'ExtensionHost.start'
  )
  console.log({ id })
  let _onmessage
  return {
    get onmessage() {
      return _onmessage
    },
    set onmessage(listener) {
      _onmessage = listener
      // TODO actually set listener
    },
    dispose() {
      return SharedProcess.invoke(
        /* ExtensionHost.send */ 'ExtensionHost.dispose',
        /* id */ id
      )
    },
    send(message) {
      return SharedProcess.invoke(
        /* ExtensionHost.send */ 'ExtensionHost.send',
        /* id */ id,
        /* message */ message
      )
    },
  }
}
