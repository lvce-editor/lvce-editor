export const name = 'sample.error-dependency-module-not-found'

export const test = async ({ Extension, QuickPick, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialog = Locator('#Dialog')
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText(`Failed to activate extension sample.error-dependency-module-not-found: dependency not found ./not-found.js`)
  // TODO error message could be improved
  // TODO show code frame
  // TODO stack could be improved
}
