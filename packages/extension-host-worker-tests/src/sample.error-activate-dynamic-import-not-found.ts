export const name = 'sample.error-activate-dynamic-import-not-found'

export const skip = 1

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
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.error-activate-dynamic-import-not-found: Module not found "./add.js"`,
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(
    `  1 | export const activate = async () => {
> 2 |   const add = await import('./add.js')
  3 |   add(1, 2)
  4 | }
  5 |`,
  )
}
