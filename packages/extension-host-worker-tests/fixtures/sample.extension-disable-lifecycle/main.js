const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

const commandMap = {
  'ExtensionApi.createViewInstance'() {
    return {
      dom: [
        {
          childCount: 1,
          className: 'Viewlet',
          type: 4,
        },
        {
          childCount: 0,
          text: 'Lifecycle Ready',
          type: 12,
        },
      ],
      type: 'setDom',
    }
  },
  'ExtensionApi.disposeViewInstance'() {},
  'ExtensionApi.getViewActions'() {
    return []
  },
  'ExtensionApi.getViewMenuEntries'() {
    return []
  },
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
          kind: 'virtualDom',
          title: 'Extension Lifecycle',
        },
      ],
    }
  },
  'ExtensionApi.renderViewInstance'() {
    return {
      patches: [],
      type: 'setPatches',
    }
  },
  'ExtensionApi.saveViewInstanceState'() {},
}

await WebWorkerRpcClient.create({ commandMap })
