import { writeFile } from 'fs/promises'
import { getTmpDir, runWithExtension, test, expect } from './_testFrameWork.js'

// manual accessibility tests

// result announcement
// nvda says:  "" ❌
// windows narrator says:  "" ❌
// orca says: "One result in one file"

// result list focus
// nvda says:  "References Tree View"
// windows narrator says:  "References Tree"
// orca says:  "References Tree"

// file focus
// nvda says:  "add.js, expanded level one, one of two"
// windows narrator says:  "add.js, one of two, level 1, expanded, selected, heading level 1" ❌
// orca says:  "add.js, expanded, tree level 1"

// no results
// nvda says:  "" ❌
// windows narrator says:  "" ❌
// orca says:  "No Results"

// error
// nvda says:  "" ❌
// windows narrator says:  "" ❌
// orca says:  "Failed to execute reference provider: oops"

// TODO when there are no results or there is an error, the references list should be hidden

test('sample.reference-provider-accessibility', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-accessibility',
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

  const viewletReferencesMessage = page.locator('.LocationsMessage')
  await expect(viewletReferencesMessage).toHaveText('1 result in 1 file')

  const referencesList = page.locator('.LocationList')
  await expect(referencesList).toHaveAttribute('role', 'tree')
  // await expect(referencesList).toHaveAttribute('aria-label', 'References') // TODO
  await expect(referencesList).toHaveAttribute('tabindex', '0')
  await expect(referencesList).toBeFocused()

  // const referenceItems = viewletReferences.locator('.TreeItem')
  // await expect(referenceItems).toHaveCount(2)

  // const referenceItemOne = referenceItems.nth(0)
  // await expect(referenceItemOne).toHaveText('index.js')
  // const referenceItemTwo = referenceItems.nth(1)
  // await expect(referenceItemTwo).toHaveText('test')

  // TODO test for correct aria attributes
})
