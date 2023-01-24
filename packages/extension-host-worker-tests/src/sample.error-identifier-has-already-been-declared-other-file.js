const name = 'sample.error-identifier-has-already-been-declared-other-file'

test('sample.error-identifier-has-already-been-declared-other-file', async () => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const errorMessage = Locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.error-identifier-has-already-been-declared-other-file: Failed to import http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-identifier-has-already-been-declared-other-file/main.js: Unknown Network Error`
  )
  // TODO improve error message
  // TODO show useful codeframe
  // const codeFrame = Locator('#DialogBodyErrorCodeFrame')
})

export {}
