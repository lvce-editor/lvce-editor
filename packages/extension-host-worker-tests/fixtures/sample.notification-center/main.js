const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

let rpc
rpc = await WebWorkerRpcClient.create({
  commandMap: {
    async 'ExtensionApi.executeCommand'() {
      await rpc.invoke('Extensions.showNotification', 'info', 'Build complete')
    },
  },
})
