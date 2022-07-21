import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const listen = async () => {
  // TODO maybe use direct websocket connection
  // overhead would be that there is another websocket connection
  // but benefit would be that messages aren't routed through shared process
  // and that messages can be easier debugged:
  // extension messages go throught extension websocket,
  // shared process messages go through shared process websocket
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
