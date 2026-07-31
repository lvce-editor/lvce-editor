export const extensionId = 'sample.extension-disable-lifecycle'

export const viewId = 'sample.extension-disable-lifecycle-view'

export const activityBarItemSelector = '.ActivityBarItem[title="Extension Lifecycle"]'

export const statusBarItemSelector = '.StatusBarItem[name="extension-lifecycle"]'

export const runningExtensionSelector = '.RunningExtensionId'

export const addLifecycleExtension = async ({ ActivityBar, Command, Extension }) => {
  const uri = new URL('.', import.meta.url).toString().replace(/\/$/, '')
  await Extension.addWebExtension(uri)
  await Extension.enableWorkspace(extensionId)
  await ActivityBar.handleExtensionsChanged()
  const activationResult = await Command.execute('ExtensionManagement.activateByEvent', 'onStatusBarItem', '', 0)
  if (activationResult.error) {
    throw activationResult.error
  }
  await Command.execute('Layout.handleExtensionsChanged')
}

export const disableLifecycleExtension = async ({ ExtensionDetail }) => {
  await ExtensionDetail.open(extensionId)
  await ExtensionDetail.handleClickDisable()
}

export const enableLifecycleExtension = async ({ Command, ExtensionDetail }) => {
  await ExtensionDetail.handleClickEnable()
  if (Command) {
    const activationResult = await Command.execute('ExtensionManagement.activateByEvent', 'onStatusBarItem', '', 0)
    if (activationResult.error) {
      throw activationResult.error
    }
    await Command.execute('Layout.handleExtensionsChanged')
  }
}
