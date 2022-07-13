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
  const testTxt = page.locator('text=test.xyz')
  await testTxt.click()

  const token = page.locator('.Token').first()
  await expect(token).toBeVisible()
  await token.click()

  const cursor = page.locator('.EditorCursor')
  await expect(cursor).toHaveCount(1)

  await page.keyboard.press('Control+Space')

  const overlayMessage = page.locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO maybe have a setting to handle this kind of error without showing a popup,
  // just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Failed to execute completion provider: invalid completion item: 42`
  )
})
