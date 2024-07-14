export const name = 'viewlet.editor-source-actions'

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect, FindWidget }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file.txt`,
    `hello world
`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.txt`)

  // act
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openSourceActions()

  // assert
  const sourceActionsView = Locator('.EditorSourceActions')
  await expect(sourceActionsView).toBeVisible()
  const heading = Locator('.SourceActionHeading')
  await expect(heading).toBeVisible()
  await expect(heading).toHaveText('Source Actions')
  const sourceActionItems = Locator('.SourceActionItem')
  await expect(sourceActionItems).toHaveCount(2)
  const firstAction = sourceActionItems.nth(0)
  await expect(firstAction).toHaveText('Organize Imports')
  const secondAction = sourceActionItems.nth(1)
  await expect(secondAction).toHaveText('Sort Imports')
}
