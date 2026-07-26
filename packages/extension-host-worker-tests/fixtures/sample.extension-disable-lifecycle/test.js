export const extensionId = 'sample.extension-disable-lifecycle'

export const activityBarItemSelector = '.ActivityBarItem[title="Extension Lifecycle"]'

export const statusBarItemSelector = '.StatusBarItem[name="extension-lifecycle"]'

export const runningExtensionSelector = '.RunningExtensionId'

export const addLifecycleExtension = async ({ ActivityBar, Extension }) => {
  await Extension.addWebExtension(new URL('.', import.meta.url).toString())
  await ActivityBar.handleExtensionsChanged()
  await Extension.activateByEvent('onStatusBarItem', '', 0)
}

export const disableLifecycleExtension = async ({ ExtensionDetail }) => {
  await ExtensionDetail.open(extensionId)
  await ExtensionDetail.handleClickDisable()
}

export const enableLifecycleExtension = async ({ ExtensionDetail }) => {
  await ExtensionDetail.handleClickEnable()
}
