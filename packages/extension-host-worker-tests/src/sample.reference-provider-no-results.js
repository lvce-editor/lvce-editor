import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.reference-provider-no-results', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const { Main, Editor, ContextMenu, locator } = await runWithExtension({
    name: 'sample.reference-provider-no-results',
    folder: tmpDir,
  })

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Find all references')

  // assert
  const viewletLocations = locator('.Viewlet[data-viewlet-id="Locations"]')
  await expect(viewletLocations).toBeVisible()

  // TODO should display references as tree or list view
  await expect(viewletLocations).toHaveText(`No Results`)
})
