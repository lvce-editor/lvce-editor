test('viewlet.explorer-rename-file-cancel', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')

  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(1)
  await Explorer.rename()

  // assert
  const explorer = Locator('.Explorer')
  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.cancelEdit()

  // assert
  await expect(inputBox).toBeHidden()
  const file2 = Locator('.TreeItem', { hasText: 'file2.txt' })
  await expect(file2).toBeVisible()
  await expect(explorer).toBeFocused()
  await expect(file2).toHaveId('TreeItemActive')
})
