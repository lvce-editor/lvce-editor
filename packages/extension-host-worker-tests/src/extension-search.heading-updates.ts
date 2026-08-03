import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'extension-search.heading-updates'

export const test: Test = async ({ expect, ExtensionSearch, Locator }) => {
  await ExtensionSearch.open()
  const heading = Locator('.SideBarTitleAreaTitle')
  await expect(heading).toHaveText('Extensions: Installed')

  await ExtensionSearch.handleInput('atom')
  await expect(heading).toHaveText('Extensions: Marketplace')

  await ExtensionSearch.handleInput('@disabled')
  await expect(heading).toHaveText('Extensions: Disabled')
}
