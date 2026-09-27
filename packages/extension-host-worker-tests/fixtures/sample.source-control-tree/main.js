const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

let lastFile = ''

const commandMap = {
  'ExtensionApi.executeCommand'(id, file) {
    if (id === 'sourceControlTree.record') lastFile = file
    return lastFile
  },
  'ExtensionApi.executeSourceControlGetBadgeCount'() {
    return 3
  },
  'ExtensionApi.executeSourceControlGetFeatures'() {
    return {}
  },
  'ExtensionApi.executeSourceControlGetGroups'() {
    return [
      {
        id: 'working-tree',
        label: lastFile ? `Recorded ${lastFile}` : 'Changes',
        items: [
          { file: 'src/nested/package.json', icon: '', iconTitle: 'Added', type: 8 },
          { file: 'src/package.json', icon: '', iconTitle: 'Modified', type: 8 },
          { file: 'test/package.json', icon: '', iconTitle: 'Added', type: 8 },
        ],
      },
    ]
  },
  'ExtensionApi.executeSourceControlIsActive'(_id, scheme) {
    return scheme === 'memfs'
  },
  'ExtensionApi.getSourceControlProviderRegistrySnapshot'() {
    return {
      providers: [
        {
          id: 'sample-source-control-tree',
        },
      ],
    }
  },
  'ExtensionApi.getStatusBarItems'() {
    return []
  },
  'ExtensionApi.getViewActions'() {
    return []
  },
  'ExtensionApi.getViewMenuEntries'() {
    return []
  },
  'ExtensionApi.getViewRegistrySnapshot'() {
    return {
      views: [],
    }
  },
}

await WebWorkerRpcClient.create({ commandMap })
