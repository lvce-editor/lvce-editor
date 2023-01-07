export const mockExec = (command, args, options) => {
  if (command === 'test-source-control') {
    if (args[0] === 'get-files') {
      return {
        stdout: `file-1.txt
file-2.txt`,
        stderr: ``,
        exitCode: 128,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

const name = 'sample.source-control-provider-exec'

test('sample.source-control-provider-exec', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await SideBar.open('Source Control')

  const viewletTree = Locator('.SourceControlItems')

  await expect(viewletTree).toBeVisible()

  const treeItem1 = Locator('.TreeItem').nth(0)
  await expect(treeItem1).toHaveText('/test/file-1.txt')
  const treeItem2 = Locator('.TreeItem').nth(1)
  await expect(treeItem2).toHaveText('/test/file-2.txt')
})

export {}
