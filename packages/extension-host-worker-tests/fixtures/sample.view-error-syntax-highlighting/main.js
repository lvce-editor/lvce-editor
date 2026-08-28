const { WebWorkerRpcClient } = await import('/static/js/lvce-editor-rpc.js')

const view = {
  icon: 'symbol-keyword',
  id: 'sample.view-error-syntax-highlighting',
  kind: 'virtualDom',
  title: 'Error Syntax Highlighting',
}

const commandMap = {
  'ExtensionApi.createViewInstance'() {
    throw new Error('Synthetic view creation failure')
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
      views: [view],
    }
  },
}

await WebWorkerRpcClient.create({ commandMap })
