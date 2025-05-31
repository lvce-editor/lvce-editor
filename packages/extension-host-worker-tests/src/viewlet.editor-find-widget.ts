export const name = 'viewlet.editor-find-widget'

export const skip = 1

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect, FindWidget }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFindWidget()

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
