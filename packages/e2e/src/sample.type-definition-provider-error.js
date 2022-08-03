import {
  test,
  getTmpDir,
  runWithExtension,
  writeFile,
  expect,
} from './_testFrameWork.js'

// TODO test is flaky https://github.com/lvce-editor/lvce-editor/runs/7658611842?check_suite_focus=true
test.skip('sample.type-definition-provider-error', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
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
  const testTxt = page.locator('text=test.js')
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

  // TODO should say 'Failed to execute type definition provider: oops'
  // await expect(overlayMessage).toHaveText('oops')
})
