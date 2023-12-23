// TODO test might be flaky https://github.com/lvce-editor/lvce-editor/runs/7490211933?check_suite_focus=true

export const name = 'viewlet.explorer-create-file'

export const test = async ({ FileSystem, Workspace, Explorer, ContextMenu, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')

  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(-1)
  await Explorer.openContextMenu()
  await ContextMenu.selectItem('New File...')
  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await inputBox.type('created.txt')
  await Explorer.updateEditingValue('created.txt')
  await Explorer.acceptEdit()

  // assert
  const newFile = Locator('text=created.txt')
  await expect(newFile).toBeVisible()
}
