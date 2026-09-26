export const testManyStatusBarItems = async ({ Command, Extension, expect, Locator, Settings }, count) => {
  const extensionId = `sample.extension-many-status-bar-items-${count}`
  const extensionUri = new URL(`../${extensionId}/`, import.meta.url).toString()

  try {
    await Settings.update({
      'statusBar.builtinNotificationsEnabled': true,
      'statusBar.builtinProblemsEnabled': true,
      'statusBar.itemsVisible': true,
    })
    await Command.execute('Layout.showStatusBar')
    await Command.execute('Layout.loadStatusBarIfVisible')
    await Extension.addWebExtension(extensionUri)
    await Command.execute('ExtensionHost.executeCommand', `manyStatusBarItems${count}.create`)
    await Command.execute('StatusBar.handleExtensionsChanged')

    const items = Locator('.StatusBarItem[name^="many-status-bar-items-"]')
    await expect(items).toHaveCount(count)
    await expect(Locator('.StatusBarItem[name="many-status-bar-items-0"]')).toHaveText('Item 0')
    await expect(Locator(`.StatusBarItem[name="many-status-bar-items-${count - 1}"]`)).toHaveText(`Item ${count - 1}`)
    await expect(Locator('.StatusBarItem[name="Problems"]')).toHaveCount(1)
  } finally {
    await Extension.disableWorkspace(extensionId)
    await Command.execute('StatusBar.handleExtensionsChanged')
  }

  await expect(Locator('.StatusBarItem[name^="many-status-bar-items-"]')).toHaveCount(0)
  await expect(Locator('.StatusBarItem[name="Problems"]')).toHaveCount(1)
}
