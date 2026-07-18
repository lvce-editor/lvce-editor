import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-restore-previous-editor'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/example.txt`
  await FileSystem.writeFile(file, 'example')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)

  await Locator('.ActivityBarItem[title="Search"]').click()
  await Locator('#SideBar button[title="Open New Search Editor"]').click()

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
  await tabs.nth(1).locator('.EditorTabCloseButton').click()

  await expect(tabs).toHaveCount(1)
  await expect(tabs.nth(0).locator('.TabTitle')).toHaveText('example.txt')
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
  await expect(Locator('.Editor')).toBeVisible()
}
