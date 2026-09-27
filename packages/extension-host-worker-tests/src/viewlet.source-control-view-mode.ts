import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.source-control-view-mode'

export const test: Test = async ({ ActivityBar, Command, expect, Extension, FileSystem, Locator, SourceControl, Workspace }) => {
  await Workspace.setPath(await FileSystem.getTmpDir())
  const extensionUri = new URL('../fixtures/sample.source-control-tree', import.meta.url).toString().replace(/\/$/, '')
  await Extension.addWebExtension(extensionUri)
  await ActivityBar.handleExtensionsChanged()
  await Command.execute('ExtensionManagement.activateByEvent', 'onSourceControl:memfs', '', 0)
  await Command.execute('Layout.handleExtensionsChanged')
  await SourceControl.show()

  const actions = Locator('.SideBarTitleArea')
  const rows = Locator('.Viewlet.SourceControl .TreeItem')
  const viewAsTree = actions.locator('[name="ViewAsTree"]')
  const viewAsList = actions.locator('[name="ViewAsList"]')
  await expect(rows).toHaveCount(4)
  await expect(rows.nth(0)).toHaveText('Changes3')
  await viewAsTree.click()

  await expect(rows).toHaveCount(7)
  await expect(viewAsList).toBeVisible()
  await expect(rows.nth(1).locator('.Label')).toHaveText('src')
  await expect(rows.nth(2).locator('.Label')).toHaveText('nested')
  await expect(rows.nth(3).locator('.Label')).toHaveText('package.json')
  await expect(rows.nth(5).locator('.Label')).toHaveText('test')
  await rows.nth(2).click()
  await expect(rows).toHaveCount(6)
  await rows.nth(2).click()
  await expect(rows).toHaveCount(7)
  await SourceControl.handleClickSourceControlButtons(3, 'Record File')
  await expect(rows.nth(0)).toHaveText('Recorded src/nested/package.json3')
  const treeFile = await Command.execute('ExtensionHost.executeCommand', 'sourceControlTree.lastFile')
  if (treeFile !== 'src/nested/package.json') throw new Error(`Wrong tree file action target: ${treeFile}`)

  await viewAsList.click()
  await expect(viewAsTree).toBeVisible()
  await expect(rows).toHaveCount(4)
  await expect(rows.nth(0)).toHaveText('Recorded src/nested/package.json3')
  await expect(rows.nth(1).locator('.DecorationIcon')).toHaveAttribute('title', 'Added')
  await expect(rows.nth(2).locator('.DecorationIcon')).toHaveAttribute('title', 'Modified')
  await SourceControl.handleClickSourceControlButtons(2, 'Record File')
  await expect(rows.nth(0)).toHaveText('Recorded src/package.json3')
  const listFile = await Command.execute('ExtensionHost.executeCommand', 'sourceControlTree.lastFile')
  if (listFile !== 'src/package.json') throw new Error(`Wrong list file action target: ${listFile}`)
}
