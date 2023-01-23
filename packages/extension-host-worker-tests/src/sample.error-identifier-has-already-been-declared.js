const name = 'sample.error-identifier-has-already-been-declared'

test('sample.error-identifier-has-already-been-declared', async () => {
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
    `Error: Failed to activate extension sample.error-identifier-has-already-been-declared: Failed to import http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-identifier-has-already-been-declared/main.js: SyntaxError: Identifier 'x' has already been declared`
  )
  // TODO code frame has wrong location
})

export {}
