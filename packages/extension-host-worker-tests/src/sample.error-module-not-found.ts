export const name = 'sample.error-module-not-found'

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
  await expect(errorMessage).toHaveText(`Error: Failed to activate extension sample.error-module-not-found: Module not found "./add.js"`)

  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(
    `> 1 | import add from './add.js'
  2 |
  3 | export const activate = () => {
  4 |   add(1, 2)`,
  )
}
