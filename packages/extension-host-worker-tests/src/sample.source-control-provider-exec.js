export const mockExec = (command, args, options) => {
  if (command === 'test-source-control') {
    if (args[0] === 'get-files') {
      return {
        stdout: `file-1.txt
file-2.txt`,
        stderr: ``,
        exitCode: 0,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

export const name = 'sample.source-control-provider-exec'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await SideBar.open('Source Control')

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
  await expect(treeItems.nth(0)).toHaveText('file-1.txt')
  await expect(treeItems.nth(1)).toHaveText('file-2.txt')
}
