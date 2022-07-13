import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.completion-provider-error-invalid-return-value-undefined', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.completion-provider-error-invalid-return-value-undefined',
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
  // TODO should say failed to load completions because of invalid return value
  // or just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Cannot read properties of undefined (reading 'filter')`
  )
})
