import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-detail-size'

export const test: Test = async ({ expect, ExtensionDetail, Locator }) => {
  await ExtensionDetail.open('builtin.theme-atom-one-dark')

  const size = Locator('.AdditionalDetailsEntry').first().locator('.MoreInfoEntry').nth(4).locator('.MoreInfoEntryValue')
  await expect(size).toHaveText('40 kB')
}
