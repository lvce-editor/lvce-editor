const name = 'sample.error-import-data-url-csp-violation'

test('sample.error-import-data-url-csp-violation', async () => {
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
    `Error: Failed to activate extension sample.error-import-data-url-csp-violation: Failed to import http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-import-data-url-csp-violation/main.js: Unknown Network Error`
  )
  // TODO error message is not good
  // TODO code frame has wrong location
})

export {}
