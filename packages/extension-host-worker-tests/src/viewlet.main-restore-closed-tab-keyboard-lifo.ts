import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-closed-tab-keyboard-lifo'

const ctrlShiftT = 3120

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [`${tmpDir}/first.ts`, `${tmpDir}/second.ts`, `${tmpDir}/third.ts`]
  await FileSystem.setFiles([
    { content: 'export const first = 1', uri: files[0] },
    { content: 'export const second = 2', uri: files[1] },
    { content: 'export const third = 3', uri: files[2] },
  ])
  await Workspace.setPath(tmpDir)
  for (const file of files) {
    await Main.openUri(file)
  }

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(3)
  await Main.closeActiveEditor()
  await Main.closeActiveEditor()
  await expect(tabs).toHaveCount(1)

  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)
  await expect(tabs).toHaveCount(2)
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText('second.ts')

  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)
  await expect(tabs).toHaveCount(3)
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText('third.ts')
}
