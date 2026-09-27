import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-process-reopen'

export const test: Test = async ({ Command, expect, FileSystem, KeyBoard, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setUri(tmpDir)
  await Settings.update({ 'terminal.backend': 'real' })
  for (let cycle = 0; cycle < 3; cycle++) {
    await Command.execute('Layout.showPanel', 'Terminals')
    const terminal = Locator('.XtermTerminal')
    await expect(terminal).toBeVisible()
    await expect(terminal.locator('.xterm-helper-textarea')).toBeFocused()
    const input = `printf 'reopened-%s\\n' ${cycle}`
    for (const char of input) await KeyBoard.press(char === ' ' ? 'Space' : char)
    await KeyBoard.press('Enter')
    await expect(terminal).toContainText(`reopened-${cycle}`)
    await Command.execute('Terminals.killTerminal')
    await expect(terminal).toHaveCount(0)
  }
}
