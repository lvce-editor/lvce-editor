export const name = 'sample.formatting-provider-preserve-cursor-position'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `<h1   class="abc">hello world</h1>`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 5)

  // act
  await Editor.format()

  // assert
  const editorRow = Locator('.EditorRow').nth(0)
  await expect(editorRow).toHaveText('<h1 class="abc">hello world</h1>')

  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('translate', /^(23|24|25|26|27|28|29).*?px$/)
}
