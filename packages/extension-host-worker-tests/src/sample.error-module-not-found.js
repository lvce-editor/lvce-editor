const name = 'sample.error-module-not-found'

test('sample.error-module-not-found', async () => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialog = Locator('#Dialog')
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText(`Failed to activate extension sample.error-module-not-found: dependency not found ./add.js`)
  // TODO error message is not good
  // TODO code frame has wrong location
})

export {}
