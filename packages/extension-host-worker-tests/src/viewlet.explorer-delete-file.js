// TODO maybe call removeDirent function directly instead of opening context menu
export const name = 'viewlet.explorer-delete-file'

export const test = async ({ FileSystem, Workspace, Explorer, ContextMenu, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(0)
  await Explorer.openContextMenu()

  // assert
  await ContextMenu.selectItem('Delete')
  const file1 = Locator('text=file1.txt')
  await expect(file1).toBeHidden()
}
