import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-panel-hide-resize'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 50 }, (_, index) => `file-${String(index).padStart(2, '0')}.txt`)
  await Promise.all(files.map((file) => FileSystem.writeFile(`${tmpDir}/${file}`, file)))

  await Command.execute('Layout.showPanel', 'Problems')
  await Workspace.setPath(tmpDir)

  const newlyVisibleItem = Locator('.Explorer .TreeItem[aria-label="file-24.txt"]')
  await expect(newlyVisibleItem).toHaveCount(0)

  await Command.execute('Layout.hidePanel')

  await expect(newlyVisibleItem).toBeVisible()
}
