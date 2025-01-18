import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.command-provider-error-command-not-found'

export const test = async ({ Extension, QuickPick, Locator, expect }: Test) => {
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
  await expect(dialogErrorMessage).toHaveText('Error: Failed to execute command: command xyz.sampleCommand not found')
}
