import { writeFile } from 'fs/promises'
import { getTmpDir, runWithExtension, test, expect } from './_testFrameWork.js'

test('sample.reference-provider-error', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-error',
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

  // const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  // await expect(viewletLocations).toBeVisible()

  // TODO should show part of stack trace maybe?
  // await expect(viewletLocations).toHaveText(
  //   `Failed to execute reference provider: oops`
  // )
})
