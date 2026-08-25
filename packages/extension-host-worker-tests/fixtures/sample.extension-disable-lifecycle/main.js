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
  'ExtensionApi.executeSourceControlGetBadgeCount'() {
    return 3
  },
  'ExtensionApi.executeSourceControlGetFeatures'() {
    return {}
  },
  'ExtensionApi.executeSourceControlGetGroups'() {
    return [
      {
        id: 'changes',
        items: [
          { file: 'first.txt', type: 8 },
          { file: 'second.txt', type: 8 },
          { file: 'third.txt', type: 8 },
        ],
        label: 'Changes',
      },
    ]
  },
  'ExtensionApi.executeSourceControlIsActive'(_id, scheme) {
    return scheme === 'memfs'
  },
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
  'ExtensionApi.getSourceControlProviderRegistrySnapshot'() {
    return {
      providers: [
        {
          id: 'extension-lifecycle-source-control',
        },
      ],
    }
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
