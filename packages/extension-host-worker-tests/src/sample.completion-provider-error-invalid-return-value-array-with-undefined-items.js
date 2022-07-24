import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.completion-provider-error-invalid-return-value-array-with-undefined-items', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.completion-provider-error-invalid-return-value-array-with-undefined-items',
    folder: tmpDir,
  })

  await page.openUri(`${tmpDir}/test.xyz`)
  await page.setCursor(0, 0)
  await page.openCompletion()

  const overlayMessage = page.locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO maybe just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Failed to execute completion provider: VError: invalid completion result: expected completion item to be of type object but was of type undefined`
  )
})
