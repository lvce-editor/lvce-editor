export const name = 'sample.tab-completion-provider-snippet'

export const skip = 1

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `h1
`,
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 2)
  await Editor.executeTabCompletion()

  // assert
  const editor = Locator('.Viewlet.Editor')
  await expect(editor).toHaveText(`<h1></h1>`)
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('translate', /^(32|33|34|35|36|37|38|39).*?px$/)
}
