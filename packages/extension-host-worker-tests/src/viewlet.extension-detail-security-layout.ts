import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-detail-security-layout'

export const test: Test = async ({ expect, ExtensionDetail, Locator }) => {
  await ExtensionDetail.open('builtin.theme-atom-one-dark')
  await ExtensionDetail.selectFeatures()

  await Locator('.FeaturesList .Feature[name="Security"]').click()

  const definitionList = Locator('.SecurityDefinitionList')
  await expect(definitionList).toHaveCSS('display', 'grid')
  await expect(definitionList).toHaveCSS('align-items', 'baseline')
  await expect(definitionList.locator(':scope > dd').first()).toHaveCSS('margin-left', '0px')
}
