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
    await expect(Locator('.StatusBarItem[name="Problems"]')).toHaveCount(1)
    await Extension.addWebExtension(extensionUri)
    await Command.execute('ExtensionHost.executeCommand', `manyStatusBarItems${count}.create`)
    await Command.execute('StatusBar.handleExtensionsChanged')

    await expect(Locator('.StatusBarItem[name="many-status-bar-items-0"]')).toHaveText('Item 0')

    if (count > 20) {
      await Command.execute('Layout.handleResize', 800, 720)
      await expect(Locator(`.StatusBarItem[name="many-status-bar-items-${count - 1}"]`)).toHaveCount(0)
      await expect(Locator('.StatusBarItem[name="many-status-bar-items-20"]')).toHaveCount(0)

      await Command.execute('Layout.handleResize', 1600, 720)
      await expect(Locator('.StatusBarItem[name="many-status-bar-items-20"]')).toHaveCount(1)
    }
  } finally {
    await Extension.disableWorkspace(extensionId)
    await Command.execute('StatusBar.handleExtensionsChanged')
  }

  await expect(Locator('.StatusBarItem[name^="many-status-bar-items-"]')).toHaveCount(0)
  await expect(Locator('.StatusBarItem[name="Problems"]')).toHaveCount(1)
}
