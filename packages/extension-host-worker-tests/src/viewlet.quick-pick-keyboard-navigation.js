test('viewlet.explorer-keyboard-navigation', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.open()

  // assert
  const quickPick = Locator('#QuickPick')
  await expect(quickPick).toBeVisible()
  const quickPickItems = Locator('.QuickPickItem')
  await expect(quickPickItems.nth(0)).toHaveId('QuickPickItemActive')

  // act
  await QuickPick.focusNext()

  // assert
  await expect(quickPickItems.nth(0)).toHaveId('')
  await expect(quickPickItems.nth(1)).toHaveId('QuickPickItemActive')

  // act
  await QuickPick.focusPrevious()

  // assert
  await expect(quickPickItems.nth(0)).toHaveId('QuickPickItemActive')
  await expect(quickPickItems.nth(1)).toHaveId('')

  // act
  await QuickPick.focusIndex(9)

  // assert
  await expect(quickPickItems.nth(9)).toHaveId('QuickPickItemActive')

  // act
  await QuickPick.focusNext()
  await expect(quickPickItems.nth(9)).toHaveId('QuickPickItemActive')

  // act
  await QuickPick.setValue('')
})
