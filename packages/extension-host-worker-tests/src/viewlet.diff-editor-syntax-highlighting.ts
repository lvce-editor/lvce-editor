export const name = 'viewlet.diff-editor-syntax-highlighting'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file.ts`
  await FileSystem.writeFile(filePath, 'const rightValue = 2')
  await Workspace.setPath(tmpDir)

  await Main.openUri(`diff://data://const leftValue = 1<->${filePath}`)

  await expect(Locator('.DiffEditorContentLeft .Token.Keyword')).toHaveText('const')
  await expect(Locator('.DiffEditorContentLeft .Token.Numeric')).toHaveText('1')
  await expect(Locator('.DiffEditorContentRight .Token.Keyword')).toHaveText('const')
  await expect(Locator('.DiffEditorContentRight .Token.Numeric')).toHaveText('2')
}
