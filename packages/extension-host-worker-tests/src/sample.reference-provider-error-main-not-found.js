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
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-error-main-not-found',
    folder: tmpDir,
  })
  await page.openUri(`${tmpDir}/test.xyz`)
  await page.setCursor(0, 0)
  await page.openEditorContextMenu()
  await page.selectContextMenuItem('Find all references')

  const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  await expect(viewletLocations).toBeVisible()

  // TODO should improve error message
  // TODO should show part of stack trace maybe?
  // const origin = location.origin
  const mainUrl = new URL(
    '../fixtures/sample.reference-provider-error-main-not-found/not-found.js',
    location.href.slice(0, location.href.lastIndexOf('/')) + '/'
  ).toString()
  await expect(viewletLocations).toHaveText(
    `Error: Failed to activate extension sample.reference-provider-error-main-not-found: TypeError: Failed to fetch dynamically imported module: ${mainUrl}`
  )
})
