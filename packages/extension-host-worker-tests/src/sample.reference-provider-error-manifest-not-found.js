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
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-error-manifest-not-found',
    folder: tmpDir,
  })
  await page.openUri(`${tmpDir}/test.xyz`)
  await page.setCursor(0, 0)
  await page.openEditorContextMenu()
  await page.selectContextMenuItem('Find all references')

  // TODO viewlet locations should still be visible
  // const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  // await expect(viewletLocations).toBeVisible()

  // await expect(viewletLocations).toHaveText(
  //   `Failed to execute reference provider: Failed to activate extension`
  // )

  // TODO should show dialog with json stack trace
})
