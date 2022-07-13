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
  const testTxt = page.locator('text=test.xyz')
  await testTxt.click()

  const token = page.locator('.Token', { hasText: 'add(1, 2)' })
  await token.click({
    button: 'right',
  })

  const contextMenuItemGoToTypeDefinition = page.locator('.MenuItem', {
    hasText: 'Go To Type Definition',
  })
  await contextMenuItemGoToTypeDefinition.click()

  const overlayMessage = page.locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO should show overlay with stack trace in development mode
  // TODO should print extension id and error message
  await expect(overlayMessage).toHaveText('Error: Failed to activate extension')
})
