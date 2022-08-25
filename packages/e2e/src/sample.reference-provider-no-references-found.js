import { writeFile } from 'fs/promises'
import { getTmpDir, runWithExtension, test, expect } from './_testFrameWork.js'

// TODO test is flaky https://github.com/lvce-editor/lvce-editor/runs/7568058650?check_suite_focus=true
test.skip('sample.reference-provider-no-references-found', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    `${tmpDir}/test.js`,
    `export const add = () => {}
`
  )
  const page = await runWithExtension({
    name: 'sample.reference-provider-no-references-found',
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

  const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  await expect(viewletLocations).toBeVisible()

  // TODO should display references as tree or list view
  await expect(viewletLocations).toHaveText(`No Results`)
})
