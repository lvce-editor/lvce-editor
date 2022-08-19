const name = 'sample.command-provider'

test.skip('sample.command-provider', async () => {
  // arrange
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  // TODO probably sample command should show a notification
  // and the notification text can be asserted here
})

export {}
