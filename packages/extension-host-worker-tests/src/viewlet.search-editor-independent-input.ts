import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-independent-input'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Locator('.ActivityBarItem[title="Search"]').click()

  const sideBarInput = Locator('#SideBar textarea[name="SearchValue"]')
  await sideBarInput.click()
  await sideBarInput.type('sidebar query')
  await Locator('#SideBar button[title="Open New Search Editor"]').click()

  const editorInput = Locator('#Main textarea[name="SearchValue"]')
  await expect(editorInput).toHaveValue('')
  await editorInput.click()
  await editorInput.type('editor query')

  await expect(editorInput).toHaveValue('editor query')
  await expect(sideBarInput).toHaveValue('sidebar query')
}
