export const extensionId = 'sample.extension-disable-lifecycle'

export const viewId = 'sample.extension-disable-lifecycle-view'

export const activityBarItemSelector = '.ActivityBarItem[title="Extension Lifecycle"]'

export const statusBarItemSelector = '.StatusBarItem[name="extension-lifecycle"]'

export const runningExtensionSelector = '.RunningExtensionId'

export const workspaceUri = 'memfs:///workspace'

export const activateLifecycleExtension = async ({ Command }) => {
  const activationResult = await Command.execute('ExtensionManagement.activateByEvent', 'onStatusBarItem', '', 0)
  if (activationResult.error) {
    throw activationResult.error
  }
  await Command.execute('Layout.handleExtensionsChanged')
}

export const addLifecycleExtension = async ({ ActivityBar, Command, Extension, Workspace }) => {
  await Workspace.setPath(workspaceUri)
  const uri = new URL('.', import.meta.url).toString().replace(/\/$/, '')
  await Extension.addWebExtension(uri)
  await Extension.enableWorkspace(extensionId)
  await ActivityBar.handleExtensionsChanged()
  await activateLifecycleExtension({ Command })
}

export const disableLifecycleExtension = async ({ ExtensionDetail }) => {
  await ExtensionDetail.open(extensionId)
  await ExtensionDetail.handleClickDisable()
}

export const enableLifecycleExtension = async ({ Command, ExtensionDetail }) => {
  await ExtensionDetail.handleClickEnable()
  if (Command) {
    await activateLifecycleExtension({ Command })
  }
}

export const disableWorkspaceLifecycleExtension = async ({ ContextMenu, ExtensionDetail, Locator }) => {
  await ExtensionDetail.open(extensionId)
  await Locator('[name="DisableOptions"]').click()
  await ContextMenu.selectItem('Disable (Workspace)')
}

export const enableWorkspaceLifecycleExtension = async ({ ContextMenu, ExtensionDetail, Locator }) => {
  await ExtensionDetail.open(extensionId)
  await Locator('[name="EnableOptions"]').click()
  await ContextMenu.selectItem('Enable (Workspace)')
}
