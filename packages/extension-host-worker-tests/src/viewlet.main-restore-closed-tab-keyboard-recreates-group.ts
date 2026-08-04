import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-closed-tab-keyboard-recreates-group'

const ctrlShiftT = 3120

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const left = `${tmpDir}/left-group.ts`
  const right = `${tmpDir}/right-group.ts`
  await FileSystem.setFiles([
    { content: 'left group', uri: left },
    { content: 'right group', uri: right },
  ])
  await Workspace.setPath(tmpDir)
  await Main.openUri(left)
  await Main.splitRight()
  await Main.openUri(right)

  const groups = Locator('.EditorGroup')
  await expect(groups).toHaveCount(2)
  await Main.closeActiveEditor()
  await expect(groups).toHaveCount(1)

  await Command.execute('KeyBindings.handleKeyBinding', ctrlShiftT)
  await expect(groups).toHaveCount(2)
  await expect(groups.nth(1).locator('.MainTabSelected .TabTitle')).toHaveText('right-group.ts')
}
