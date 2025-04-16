export const name = 'sample.error-identifier-has-already-been-declared'

export const test = async ({ Extension, QuickPick, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const errorMessage = Locator('#DialogBodyErrorMessage')
  // TODO message should say SyntaxError instead of BabelParseError
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.error-identifier-has-already-been-declared: BabelParseError: Identifier 'x' has already been declared.`,
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(`  1 | let x = 1
  2 |
> 3 | let x = 2
    |     ^
  4 |
  5 | export const activate = () => {}
  6 |`)
}
