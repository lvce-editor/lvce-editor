import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-closed-tab-keyboard-original-position'

const ctrlShiftT = 3120

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [`${tmpDir}/left.ts`, `${tmpDir}/middle.ts`, `${tmpDir}/right.ts`]
  await FileSystem.setFiles([
    { content: 'left', uri: files[0] },
    { content: 'middle', uri: files[1] },
    { content: 'right', uri: files[2] },
  ])
  await Workspace.setPath(tmpDir)
  for (const file of files) {
    await Main.openUri(file)
  }

  const tabs = Locator('.MainTab')
  await Main.openUri(files[1])
  await Main.closeActiveEditor()
  await expect(tabs).toHaveCount(2)

  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)
  await expect(tabs).toHaveCount(3)
  await expect(tabs.nth(0).locator('.TabTitle')).toHaveText('left.ts')
  await expect(tabs.nth(1).locator('.TabTitle')).toHaveText('middle.ts')
  await expect(tabs.nth(2).locator('.TabTitle')).toHaveText('right.ts')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
}
