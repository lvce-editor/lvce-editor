import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.command-provider-error-command-not-found'

export const test: Test = async ({ Extension, QuickPick, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO better error message
  // TODO less obstrusive error message, maybe notification
  await expect(dialogErrorMessage).toHaveText('VError: Failed to execute command: command xyz.sampleCommand not found')
}
