test('viewlet.editor-cursor-up', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setSelections(new Uint32Array([0, 0, 0, 7]))
  await Editor.openFindWidget()

  // assert
  const findWidgetInput = Locator(
    '[data-viewlet-id="EditorFindWidget"] .InputBox'
  )
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  const findWidgetMatchCount = Locator(`.EditorFindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 2')

  // act
  await EditorFindWidget.focusNext()

  // assert
  // TODO check that selection has changed
})
