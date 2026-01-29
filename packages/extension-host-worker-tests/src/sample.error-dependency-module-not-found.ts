export const name = 'sample.error-dependency-module-not-found'

export const skip = 1

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
    `Error: Failed to activate extension sample.error-dependency-module-not-found: Module not found "./not-found.js"`,
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(
    `> 1 | import notFound from './not-found.js'
  2 |
  3 | export const add = (a, b) => {
  4 |   return a + b`,
  )
  // TODO stack could be improved
}
