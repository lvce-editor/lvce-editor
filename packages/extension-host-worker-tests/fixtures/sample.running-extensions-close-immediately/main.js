const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

await WebWorkerRpcClient.create({
  commandMap: {
    'ExtensionApi.executeCommand'() {
      setTimeout(() => close(), 0)
      return true
    },
    'ExtensionApi.ping'() {
      return true
    },
  },
})
