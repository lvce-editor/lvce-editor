export const name = 'sample.error-uri'

export const test = async ({ Extension, QuickPick, Locator, expect, Platform }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialog = Locator('#Dialog')
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  if (Platform.isFirefox()) {
    await expect(errorMessage).toHaveText(`Failed to activate extension sample.error-uri: URIError: malformed URI sequence`)
  } else {
    await expect(errorMessage).toHaveText(`Failed to activate extension sample.error-uri: URIError: URI malformed`)
  }
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(
    `> 1 | encodeURI('\\uD800')
    | ^
  2 |
  3 | export const activate = () => {}
  4 |`,
  )
}
