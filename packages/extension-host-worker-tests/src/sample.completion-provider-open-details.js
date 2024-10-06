export const skip = true

export const name = 'sample.completion-provider-open-details'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, ['   line   ', '   line   ', '   line   '].join('\n'))

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.completion-provider-open-details', import.meta.url).toString())

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
  const completionDetails = Locator('.CompletionDetails')
  await expect(completionDetails).toBeVisible()
}
