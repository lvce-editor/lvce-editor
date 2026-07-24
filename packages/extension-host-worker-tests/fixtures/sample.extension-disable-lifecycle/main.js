const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

const commandMap = {
  'ExtensionApi.getStatusBarItems'() {
    return [
      {
        icon: '',
        name: 'extension-lifecycle',
        onClick: '',
        text: 'Lifecycle Ready',
      },
    ]
  },
  'ExtensionApi.getViewRegistrySnapshot'() {
    return {
      views: [
        {
          icon: 'symbol-beaker',
          id: 'sample.extension-disable-lifecycle-view',
          title: 'Extension Lifecycle',
        },
      ],
    }
  },
}

await WebWorkerRpcClient.create({ commandMap })
