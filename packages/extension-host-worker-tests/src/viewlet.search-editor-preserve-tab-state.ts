import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-preserve-tab-state'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Locator('.ActivityBarItem[title="Search"]').click()

  const searchEditorButton = Locator('#SideBar button[title="Open New Search Editor"]')
  await searchEditorButton.click()
  const editorInput = Locator('#Main textarea[name="SearchValue"]')
  await editorInput.click()
  await editorInput.type('first editor')

  await searchEditorButton.click()
  await editorInput.click()
  await editorInput.type('second editor')

  const tabs = Locator('.MainTab')
  await tabs.nth(0).click()
  await expect(editorInput).toHaveValue('first editor')

  await tabs.nth(1).click()
  await expect(editorInput).toHaveValue('second editor')
}
