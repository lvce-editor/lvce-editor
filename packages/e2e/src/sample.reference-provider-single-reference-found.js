import { writeFile } from 'fs/promises'
import { getTmpDir, runWithExtension, test, expect } from './_testFrameWork.js'

test.skip('sample.reference-provider-single-reference-found', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-single-reference-found',
    folder: tmpDir,
  })
  const testTxt = page.locator('text=test.js')
  await testTxt.click()

  const token = page.locator('.Token').first()
  await token.click({
    button: 'right',
  })

  const contextMenuItemFindAllReferences = page.locator('.MenuItem', {
    hasText: 'Find All References',
  })
  await contextMenuItemFindAllReferences.click()

  const viewletLocations = page.locator('.Locations')
  await expect(viewletLocations).toBeVisible()

  const viewletLocationsMessage = page.locator('.LocationsMessage')
  await expect(viewletLocationsMessage).toHaveText('1 result in 1 file')

  const referenceItems = viewletLocations.locator('.TreeItem')
  await expect(referenceItems).toHaveCount(2)

  const referenceItemOne = referenceItems.nth(0)
  await expect(referenceItemOne).toHaveText('index.js')
  const referenceItemTwo = referenceItems.nth(1)
  await expect(referenceItemTwo).toHaveText('test')

  // TODO test for correct aria attributes

  // TODO test keyboard navigation

  // TODO test that cursor position changes when clicking reference to same file

  // TODO test that another file is opened when clicking reference to another file
})
