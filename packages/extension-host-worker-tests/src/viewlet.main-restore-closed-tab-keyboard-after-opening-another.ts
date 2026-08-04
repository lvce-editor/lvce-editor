import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-closed-tab-keyboard-after-opening-another'

const ctrlShiftT = 3120

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const first = `${tmpDir}/first.ts`
  const closed = `${tmpDir}/closed.ts`
  const later = `${tmpDir}/later.ts`
  await FileSystem.setFiles([
    { content: 'first', uri: first },
    { content: 'closed', uri: closed },
    { content: 'later', uri: later },
  ])
  await Workspace.setPath(tmpDir)
  await Main.openUri(first)
  await Main.openUri(closed)
  await Main.closeActiveEditor()
  await Main.openUri(later)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)

  await expect(tabs).toHaveCount(3)
  await expect(tabs.nth(0).locator('.TabTitle')).toHaveText('first.ts')
  await expect(tabs.nth(1).locator('.TabTitle')).toHaveText('closed.ts')
  await expect(tabs.nth(2).locator('.TabTitle')).toHaveText('later.ts')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
}
