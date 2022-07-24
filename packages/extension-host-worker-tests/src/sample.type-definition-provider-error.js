import {
  runWithExtension,
  test,
  expect,
  getTmpDir,
  writeFile,
} from './_testFrameWork.js'

test('sample.type-definition-provider-error', async () => {
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
    name: 'sample.type-definition-provider-error',
    folder: tmpDir,
  })
  await page.openUri(`${tmpDir}/test.xyz`)
  await page.setCursor(0, 0)
  await page.openEditorContextMenu()
  await page.selectContextMenuItem('Go To Type Definition')

  const overlayMessage = page.locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  await expect(overlayMessage).toHaveText(
    'Error: Failed to execute type definition provider: oops'
  )
})
