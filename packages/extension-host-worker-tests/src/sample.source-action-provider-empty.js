export const name = 'sample.source-action-provider-empty'

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect, Extension }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file.txt`,
    `hello world
`,
  )
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/file.txt`)

  // act
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openSourceActions()

  // assert
  const sourceActionsView = Locator('.EditorSourceActions')
  // await expect(sourceActionsView).toBeVisible()

  // TODO
  // await expect(sourceActionsView).toHaveText('No code Actions available')
}
