import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.reference-provider-error-manifest-not-found', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-error-manifest-not-found',
    folder: tmpDir,
  })
  const testTxt = page.locator('text=test.js')
  await testTxt.click()

  const token = page.locator('.Token').first()
  await token.click({
    button: 'right',
  })

  const contextMenuItemFindAllReferences = page.locator('.MenuItem', {
    hasText: 'Find all references',
  })
  await contextMenuItemFindAllReferences.click()

  // TODO viewlet locations should still be visible
  // const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  // await expect(viewletLocations).toBeVisible()

  // await expect(viewletLocations).toHaveText(
  //   `Failed to execute reference provider: Failed to activate extension`
  // )

  // TODO should show dialog with json stack trace
})
