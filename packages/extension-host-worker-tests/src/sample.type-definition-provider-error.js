import {
  runWithExtension,
  test,
  expect,
  getTmpDir,
  writeFile,
} from './_testFrameWork.js'

test('sample.type-definition-provider-error', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {
  return a + b
}

add(1, 2)
    `
  )
  const { Main, Editor, ContextMenu, locator } = await runWithExtension({
    name: 'sample.type-definition-provider-error',
    folder: tmpDir,
  })

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Go To Type Definition')

  // assert
  const overlayMessage = locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  await expect(overlayMessage).toHaveText(
    'Error: Failed to execute type definition provider: oops'
  )
})
