const { WebWorkerRpcClient } = await import('/js/lvce-editor-rpc.js')

let rpc
let notificationCount = 0
rpc = await WebWorkerRpcClient.create({
  commandMap: {
    async 'ExtensionApi.executeCommand'() {
      const messages = ['Build complete', 'Tests passed', 'Ignored after hiding']
      await rpc.invoke('Extensions.showNotification', 'info', messages[notificationCount] || 'Build complete')
      notificationCount++
    },
  },
})
