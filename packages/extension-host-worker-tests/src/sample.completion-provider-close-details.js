export const skip = true

export const name = 'sample.completion-provider-close-details'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, ['   line   ', '   line   ', '   line   '].join('\n'))

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.completion-provider-close-details', import.meta.url).toString())

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openCompletion()

  // assert
  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()

  // act
  await Editor.openCompletionDetails()

  // assert
  const completionDetails = Locator('.EditorCompletionDetails')
  await expect(completionDetails).toBeVisible()

  // act
  await Editor.closeCompletionDetails()

  // assert
  await expect(completionDetails).toBeHidden()
}
