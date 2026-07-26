const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/static/js/lvce-editor-rpc.js`)

const view = {
  icon: 'symbol-play',
  id: 'sample.running-extensions-live-view',
  kind: 'virtualDom',
  title: 'Running Extensions Live View',
}

const commandMap = {
  'ExtensionApi.createViewInstance'() {
    return {
      dom: [],
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
    return []
  },
  'ExtensionApi.getViewRegistrySnapshot'() {
    return {
      views: [view],
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
