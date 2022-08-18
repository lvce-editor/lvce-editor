/// <reference path="../typings/types.d.ts" />

const name =
  'sample.type-definition-provider-error-failed-to-activate-extension'

test('sample.type-definition-provider-error-failed-to-activate-extension', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {
  return a + b
}

add(1, 2)
    `
  )
  // act
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  // TODO open uri should return editor object
  await Main.openUri(`${tmpDir}/test.xyz`)
  // TODO editor object should have setCursor function
  await Editor.setCursor(0, 0)
  // TODO editor object should have openContextMenu function
  await Editor.openEditorContextMenu()
  // TODO contextMenu should have selectItem function
  await ContextMenu.selectItem('Go To Type Definition')

  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO error message is too long
  // TODO probably should just display "failed to execute type definition provider: TypeError: x is not a function"
  await expect(overlayMessage).toHaveText(
    'Error: Failed to activate extension sample.type-definition-provider-error-failed-to-activate-extension: TypeError: x is not a function'
  )
})
