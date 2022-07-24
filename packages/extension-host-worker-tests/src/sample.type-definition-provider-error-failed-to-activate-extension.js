import {
  runWithExtension,
  test,
  expect,
  getTmpDir,
  writeFile,
} from './_testFrameWork.js'

test('sample.type-definition-provider-error-failed-to-activate-extension', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {
  return a + b
}

add(1, 2)
    `
  )
  const page = await runWithExtension({
    name: 'sample.type-definition-provider-error-failed-to-activate-extension',
    folder: tmpDir,
  })
  // TODO open uri should return editor object
  await page.openUri(`${tmpDir}/test.xyz`)
  // TODO editor object should have setCursor function
  await page.setCursor(0, 0)
  // TODO editor object should have openContextMenu function
  await page.openEditorContextMenu()
  // TODO contextMenu should have selectItem function
  await page.selectContextMenuItem('Go To Type Definition')

  const overlayMessage = page.locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO error message is too long
  // TODO probably should just display "failed to execute type definition provider: TypeError: x is not a function"
  await expect(overlayMessage).toHaveText(
    'Error: Failed to activate extension sample.type-definition-provider-error-failed-to-activate-extension: TypeError: x is not a function'
  )
})
