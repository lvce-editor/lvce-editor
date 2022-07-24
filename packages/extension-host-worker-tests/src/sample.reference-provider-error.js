import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
} from './_testFrameWork.js'

test('sample.reference-provider-error', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-error',
    folder: tmpDir,
  })
  await page.openUri(`${tmpDir}/test.xyz`)
  await page.setCursor(0, 0)
  await page.openEditorContextMenu()
  await page.selectContextMenuItem('Find all references')

  const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  await expect(viewletLocations).toBeVisible()

  // TODO should show part of stack trace maybe?
  await expect(viewletLocations).toHaveText(
    `Error: Failed to execute reference provider: oops`
  )
})
