import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-closed-tab-keyboard-consumes-entry'

const ctrlShiftT = 3120

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/restore-once.ts`
  await FileSystem.writeFile(file, 'restore once')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)
  await Main.closeActiveEditor()

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)
  await expect(tabs).toHaveCount(1)

  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)
  await expect(tabs).toHaveCount(1)
  await expect(tabs.nth(0).locator('.TabTitle')).toHaveText('restore-once.ts')
}
