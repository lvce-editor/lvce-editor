import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-close-all-editors-command'

export const test: Test = async ({ expect, FileSystem, Locator, Main, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file-1.txt`)
  await Main.openUri(`${tmpDir}/file-2.txt`)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)

  await QuickPick.open()
  await QuickPick.setValue('>Close all Editors')
  await QuickPick.selectItem('Main: Close all Editors')

  await expect(tabs).toHaveCount(0)
}
