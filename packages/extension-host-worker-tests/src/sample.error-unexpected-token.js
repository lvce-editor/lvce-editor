const name = 'sample.error-unexpected-token'

test('sample.error-unexpected-token', async () => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialog = Locator('#Dialog')
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.error-unexpected-token: Failed to import http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-unexpected-token/main.js: SyntaxError: Unexpected number`
  )
  // TODO error message is not good
  // TODO code frame has wrong location
})

export {}
