const name = 'sample.command-provider-error-command-not-found'

test('sample.command-provider-error', async () => {
  // arrange
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO better error message
  // TODO less obstrusive error message, maybe notification
  await expect(dialogErrorMessage).toHaveText(
    'Error: Failed to execute command: command xyz.sampleCommand not found'
  )
})

export {}
