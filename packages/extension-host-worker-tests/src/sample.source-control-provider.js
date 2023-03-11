export const name = 'sample.source-control-provider'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await SideBar.open('Source Control')

  const viewletTree = Locator('.SourceControlItems')

  await expect(viewletTree).toBeVisible()

  const treeItem1 = Locator('.TreeItem').nth(0)
  await expect(treeItem1).toHaveText('file-1.txt /test')
  const treeItem2 = Locator('.TreeItem').nth(1)
  await expect(treeItem2).toHaveText('file-2.txt /test')
}
