export const name = 'sample.command-provider-error-command-registered-multiple-times'

export const test = async ({ Extension, QuickPick, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

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
    'Error: Failed to activate extension sample.command-provider-error-command-registered-multiple-times: Failed to register command xyz.sampleCommand: command cannot be registered multiple times',
  )
}
