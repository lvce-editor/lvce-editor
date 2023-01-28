export const name = 'sample.error-activate-dynamic-import-not-found'

export const test = async ({ Extension, QuickPick, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialog = Locator('#Dialog')
  // TODO error message should say module not found "./add.js"
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.error-activate-dynamic-import-not-found: Failed to import http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-activate-dynamic-import-not-found/main.js: Unknown Network Error`
  )
  // TODO show useful codeframe
  // const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  // await expect(codeFrame).toHaveText(
  //   `> 1 | const add = await import('./add.js')
  // 2 |
  // 3 | export const activate = () => {
  // 4 |   add(1, 2)`
  // )
}
