import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-closed-tab-keyboard-single'

const ctrlShiftT = 3120

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/restore-single.ts`
  await FileSystem.writeFile(file, 'export const value = 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)

  await Main.closeActiveEditor()
  await expect(tabs).toHaveCount(0)

  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)
  await expect(tabs).toHaveCount(1)
  await expect(tabs.nth(0).locator('.TabTitle')).toHaveText('restore-single.ts')
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
}
