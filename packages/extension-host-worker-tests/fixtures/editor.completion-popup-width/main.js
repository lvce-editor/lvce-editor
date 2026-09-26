const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

await WebWorkerRpcClient.create({
  commandMap: {
    'ExtensionApi.executeCompletionProvider'() {
      return [{ label: 'window.titleBarStyle', kind: 1, flags: 0, matches: [] }]
    },
    'ExtensionApi.executeResolveCompletionItemProvider'() {},
    'ExtensionApi.getCompletionProviderRegistrySnapshot'() {
      return { providers: [{ id: 'editor.completion-wide-label-provider', languageId: 'xyz' }] }
    },
  },
})
