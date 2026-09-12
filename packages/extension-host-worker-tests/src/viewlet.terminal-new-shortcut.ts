import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-new-shortcut'

export const test: Test = async ({ Command, KeyBoard, Locator, Settings, expect }) => {
  await Settings.update({ 'terminal.backend': 'mock' })
  await Command.execute('Layout.hidePanel')
  const terminal = Locator('.XtermTerminal')
  const tabs = Locator('.TerminalTab')
  const input = terminal.locator('.xterm-helper-textarea')

  await KeyBoard.press('Control+Shift+Backquote')
  await expect(terminal).toBeVisible()
  await expect(input).toBeFocused()
  await expect(tabs).toHaveCount(0)

  await KeyBoard.press('Control+Shift+Backquote')
  await expect(tabs).toHaveCount(2)
  await expect(input).toBeFocused()

  await Command.execute('Layout.hidePanel')
  await expect(terminal).toHaveCount(0)
  await KeyBoard.press('Control+Shift+Backquote')
  await expect(tabs).toHaveCount(3)
  await expect(input).toBeFocused()

  await Command.execute('Layout.showPanel', 'Problems')
  await KeyBoard.press('Control+Shift+Backquote')
  await expect(tabs).toHaveCount(4)
  await expect(input).toBeFocused()
}
