export const name = 'sample.file-system-provider-race-condition'

export const test = async ({ Extension, FileSystem, Workspace, Main, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL('../fixtures/sample.file-system-provider-race-condition', import.meta.url).toString())
  const tmpDir = `extension-host://xyz://folder`
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file-3.txt`, 'content 3')

  // act
  await Workspace.setPath(tmpDir)
  await Promise.all([Main.openUri(`${tmpDir}/file-1.txt`), Main.openUri(`${tmpDir}/file-2.txt`), Main.openUri(`${tmpDir}/file-3.txt`)])

  // assert
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(3)
  const tab1 = tabs.nth(0)
  const tab2 = tabs.nth(1)
  const tab3 = tabs.nth(2)
  await expect(tab1).toHaveAttribute('aria-selected', 'false')
  await expect(tab2).toHaveAttribute('aria-selected', 'false')
  await expect(tab3).toHaveAttribute('aria-selected', 'true')
  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(1)
  // file 3 loads first and should be focused

  // file 2 loads second

  // file 1 loads last
}
