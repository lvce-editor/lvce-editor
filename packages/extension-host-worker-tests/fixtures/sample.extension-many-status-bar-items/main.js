const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

export const start = async (count) => {
  let created = false
  const commandMap = {
    'ExtensionApi.executeCommand'() {
      created = true
    },
    'ExtensionApi.getStatusBarItems'() {
      if (!created) return []
      return Array.from({ length: count }, (_, index) => ({
        name: `many-status-bar-items-${index}`,
        text: `Item ${index}`,
      }))
    },
  }

  await WebWorkerRpcClient.create({ commandMap })
}
