const { WebWorkerRpcClient } = await import('/js/lvce-editor-rpc.js')

let rpc
rpc = await WebWorkerRpcClient.create({
  commandMap: {
    async 'ExtensionApi.executeCommand'() {
      await rpc.invoke('Extensions.showNotification', 'info', 'Build complete')
    },
  },
})
