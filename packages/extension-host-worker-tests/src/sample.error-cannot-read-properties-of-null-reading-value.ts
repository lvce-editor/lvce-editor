export const name = 'sample.error-cannot-read-properties-of-null-reading-value'

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
    `Error: Failed to activate extension sample.error-cannot-read-properties-of-null-reading-value: TypeError: Cannot read properties of null (reading 'value')`,
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(
    `   5 | const api = getApi()
   6 |
>  7 | const value = api.value
     |                   ^
   8 |
   9 | export const activate = () => {}
  10 |`,
  )
}
