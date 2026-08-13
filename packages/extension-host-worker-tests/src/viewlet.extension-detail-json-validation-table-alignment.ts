import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-detail-json-validation-table-alignment'

export const test: Test = async ({ expect, Extension, ExtensionDetail, Locator }) => {
  const extensionUri = new URL('../fixtures/viewlet.extension-detail-json-validation-table-alignment', import.meta.url).toString()
  await Extension.addWebExtension(extensionUri)
  await ExtensionDetail.open('test.json-validation-table-alignment')
  await ExtensionDetail.selectFeatures()
  await ExtensionDetail.openJsonValidation()

  const table = Locator('.FeatureContent .Table')
  const headings = table.locator('thead th.TableHeading.TableCell')
  const cells = table.locator('tbody td.TableCell')
  await expect(headings).toHaveCount(2)
  await expect(headings.nth(0)).toHaveText('File Match')
  await expect(headings.nth(1)).toHaveText('Schema')
  await expect(cells).toHaveCount(2)
  await expect(headings.nth(0)).toHaveCSS('padding-left', '10px')
  await expect(headings.nth(1)).toHaveCSS('padding-left', '10px')
  await expect(cells.nth(0)).toHaveCSS('padding-left', '10px')
  await expect(cells.nth(1)).toHaveCSS('padding-left', '10px')
}
