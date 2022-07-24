import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.completion-provider-error-invalid-return-value-number', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.completion-provider-error-invalid-return-value-number',
    folder: tmpDir,
  })
  await page.openUri(`${tmpDir}/test.xyz`)
  await page.setCursor(0, 0)
  await page.openCompletion()

  const overlayMessage = page.locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO maybe have a setting to handle this kind of error without showing a popup,
  // just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Failed to execute completion provider: VError: invalid completion result: completion must be of type array but is 42`
  )
})
