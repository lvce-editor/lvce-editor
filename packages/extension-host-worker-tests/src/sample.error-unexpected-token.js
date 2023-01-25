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
  await expect(errorMessage).toHaveText(`Error: Failed to activate extension sample.error-unexpected-token: SyntaxError: Missing semicolon.`)
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  expect(codeFrame).toHaveText(
    `> 1 | []0
    |   ^
  2 |`
  )
})

export {}
