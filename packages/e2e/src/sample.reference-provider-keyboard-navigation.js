import { writeFile } from 'fs/promises'
import { getTmpDir, runWithExtension, test, expect } from './_testFrameWork.js'

test.skip('sample.reference-provider-keyboard-navigation', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-keyboard-navigation',
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

  const viewletLocationsMessage = page.locator('.LocationsMessage')
  await expect(viewletLocationsMessage).toHaveText('3 results in 3 files')

  const referencesList = page.locator('.LocationList')
  await expect(referencesList).toBeFocused()

  const referenceListItems = referencesList.locator('.TreeItem')
  await page.keyboard.press('ArrowDown')
  const referenceListItemOne = referenceListItems.nth(0)
  await expect(referenceListItemOne).toHaveClass(/Focused/)

  await page.keyboard.press('End')
  const referenceListItemSix = referenceListItems.nth(5)
  await expect(referenceListItemSix).toHaveClass(/Focused/)

  await page.keyboard.press('ArrowUp')
  const referenceListItemFive = referenceListItems.nth(4)
  await expect(referenceListItemFive).toHaveClass(/Focused/)

  await page.keyboard.press('Home')
  await expect(referenceListItemOne).toHaveClass(/Focused/)
})
