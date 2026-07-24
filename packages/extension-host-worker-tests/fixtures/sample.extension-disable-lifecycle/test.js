export const extensionId = 'sample.extension-disable-lifecycle'

export const activityBarItemSelector = '.ActivityBarItem[title="Extension Lifecycle"]'

export const statusBarItemSelector = '.StatusBarItem[name="extension-lifecycle"]'

export const runningExtensionSelector = `.RunningExtension:has-text("${extensionId}")`

export const addLifecycleExtension = async ({ ActivityBar, Extension, Settings, StatusBar }) => {
  await Settings.update({
    'statusBar.itemsVisible': true,
  })
  await Extension.addWebExtension(import.meta.resolve('.'))
  await StatusBar.update()
  await ActivityBar.handleExtensionsChanged()
}

export const disableLifecycleExtension = async ({ ExtensionDetail }) => {
  await ExtensionDetail.open(extensionId)
  await ExtensionDetail.handleClickDisable()
}

export const enableLifecycleExtension = async ({ ExtensionDetail }) => {
  await ExtensionDetail.handleClickEnable()
}
