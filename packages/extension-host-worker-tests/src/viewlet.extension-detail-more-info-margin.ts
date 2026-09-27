import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-detail-more-info-margin'

export const test: Test = async ({ expect, ExtensionDetail, Locator }) => {
  await ExtensionDetail.open('builtin.theme-atom-one-dark')

  const moreInfo = Locator('.MoreInfo')
  await expect(moreInfo).toHaveCSS('margin-top', '0px')
  await expect(moreInfo).toHaveCSS('margin-bottom', '0px')
  await expect(moreInfo.locator('.MoreInfoEntry')).toHaveCount(5)

  const additionalDetails = Locator('.AdditionalDetails')
  await expect(additionalDetails).toContainText('Resources')
}
