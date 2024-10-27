export const name = 'viewlet.editor-rename'

export const skip = true

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect, FindWidget }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file.js`,
    `let x = 1
`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.js`)
  await Editor.setCursor(0, 5)

  // act
  await Editor.openRename()

  // assert
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act
  await FindWidget.focusNext()

  // assert
  await expect(findWidgetMatchCount).toHaveText('2 of 2')
  const editorSelection = Locator('.EditorSelection')
  await expect(editorSelection).toHaveCSS('top', '20px')
  await expect(editorSelection).toHaveCSS('width', /^(65|66|67|68|69).*?px$/)

  // act
  await FindWidget.setValue('content-not-found')

  // assert
  await expect(findWidgetMatchCount).toHaveText('No Results')
  const buttonPreviousMatch = Locator('[title="Previous Match"]')
  await expect(buttonPreviousMatch).toHaveAttribute('disabled', '')
  const buttonNextMatch = Locator('[title="Next Match"]')
  await expect(buttonNextMatch).toHaveAttribute('disabled', '')
}
