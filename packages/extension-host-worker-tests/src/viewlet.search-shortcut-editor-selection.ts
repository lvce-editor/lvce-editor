import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-shortcut-editor-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileUri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(fileUri, 'prefix abc suffix')
  await Workspace.setPath(tmpDir)
  await Main.openUri(fileUri)
  await Editor.setSelections(new Uint32Array([0, 7, 0, 10]))

  await Command.execute('Layout.openTextSearch')

  const searchInput = Locator('.SideBar textarea[name="SearchValue"]')
  await expect(searchInput).toBeVisible()
  await expect(searchInput).toBeFocused()
  await expect(searchInput).toHaveValue('abc')
}
