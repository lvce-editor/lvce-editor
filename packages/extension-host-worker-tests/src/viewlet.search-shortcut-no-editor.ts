import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-shortcut-no-editor'

export const test: Test = async ({ Command, Locator, expect }) => {
  await Command.execute('Layout.openTextSearch')

  const searchInput = Locator('.SideBar textarea[name="SearchValue"]')
  await expect(searchInput).toBeVisible()
  await expect(searchInput).toBeFocused()
}
