const name = 'sample.command-provider-error'

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
  // TODO should show stack trace
  // TODO should show babel code frame
  await expect(dialogErrorMessage).toHaveText(
    'Error: Failed to execute command: oops'
  )
})

export {}
