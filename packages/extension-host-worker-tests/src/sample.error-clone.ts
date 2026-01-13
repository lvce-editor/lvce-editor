export const name = 'sample.error-clone'

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
    `Error: Failed to activate extension sample.error-clone: DataCloneError: Failed to execute 'structuredClone' on 'WorkerGlobalScope': #<Promise> could not be cloned.`,
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(
    `> 1 | structuredClone(new Promise(() => {}))
    | ^
  2 |
  3 | export const activate = () => {}
  4 |`,
  )
}
