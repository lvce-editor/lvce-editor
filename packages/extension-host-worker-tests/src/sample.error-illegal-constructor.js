export const name = 'sample.error-illegal-constructor'

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
    `Error: Failed to activate extension sample.error-illegal-constructor: Failed to import http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-illegal-constructor/main.js: Unknown Network Error`
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  expect(codeFrame).toHaveText(
    `    6 |   } catch (error) {
   7 |     const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(url, error)
>  8 |     throw new Error(actualErrorMessage)
     |           ^
   9 |   }
  10 | }
  11 |`
  )
}
