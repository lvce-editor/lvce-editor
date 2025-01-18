export const name = 'sample.file-system-provider-reference-error'

export const test = async ({ Extension, Main, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = `extension-host://xyz://folder`

  // act
  await Main.openUri(`${tmpDir}/file-1.txt`)

  // assert
  const errorEditor = Locator('.TextEditorError')
  await expect(errorEditor).toBeVisible()
  const errorMessage = errorEditor.locator('.TextEditorErrorMessage')
  await expect(errorMessage).toHaveText(
    `VError: Failed to execute file system provider: VError: Failed to request text from "/language-basics-typescript/3c2c8cd/playground/playground/babel-parser-base.ts": ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor`,
  )
  const createFileButton = errorEditor.locator('.ButtonPrimary')
  // await expect(createFileButton).toBeHidden()// TODO
}
