const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

let inProgress = true
let rpc

const commandMap = {
  async 'ExtensionApi.executeCommand'(id) {
    inProgress = id === 'sourceControlProgress.begin'
    await rpc.invoke('Extensions.executeCommand', 'Layout.handleSourceControlProgressChange')
  },
  'ExtensionApi.executeSourceControlGetProgress'() {
    return inProgress
  },
  'ExtensionApi.executeSourceControlGetBadgeCount'() {
    return 0
  },
  'ExtensionApi.executeSourceControlGetFeatures'() {
    return {}
  },
  'ExtensionApi.executeSourceControlGetGroups'() {
    return []
  },
  'ExtensionApi.executeSourceControlIsActive'(_id, scheme) {
    return scheme === 'memfs'
  },
  'ExtensionApi.getStatusBarItems'() {
    return []
  },
  'ExtensionApi.getSourceControlProviderRegistrySnapshot'() {
    return {
      providers: [
        {
          id: 'source-control-progress',
        },
      ],
    }
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

rpc = await WebWorkerRpcClient.create({ commandMap })
