export const name = 'sample.import-json-syntax-error'

export const test = async ({ Extension, QuickPick, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const errorMessage = Locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.import-json-syntax-error: BabelParseError: This experimental syntax requires enabling one of the following parser plugin(s): "importAttributes", "importAssertions".`
  )
  // TODO enable that babel plugin
  // TODO show useful code frame
}
