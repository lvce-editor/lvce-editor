import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.reference-provider-error-main-not-found', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-error-main-not-found',
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

  const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  await expect(viewletLocations).toBeVisible()

  // TODO should improve error message
  // TODO should show part of stack trace maybe?
  // const origin = location.origin
  const mainurl = new URL(
    '../fixtures/sample.reference-provider-error-main-not-found/not-found.js',
    location.href.slice(0, location.href.lastIndexOf('/')) + '/'
  ).toString()
  await expect(viewletLocations).toHaveText(
    `Failed to activate extension sample.reference-provider-error-main-not-found: TypeError: Failed to fetch dynamically imported module: ${mainurl}`
  )
})
