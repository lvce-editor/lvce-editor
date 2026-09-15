import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-panel-persistence'

export const test: Test = async ({ Command, KeyBoard, Locator, Settings, expect }) => {
  await Settings.update({
    'terminal.backend': 'mock',
  })

  await Command.execute('Layout.showPanel', 'Terminals')
  const terminal = Locator('.XtermTerminal')
  await expect(terminal).toBeVisible()
  await terminal.click()
  await expect(terminal.locator('.xterm-helper-textarea')).toBeFocused()

  for (const character of 'touch persistent-terminal.txt') {
    await KeyBoard.press(character === ' ' ? 'Space' : character)
  }
  await KeyBoard.press('Enter')
  await expect(terminal.locator('.xterm-rows')).toContainText('persistent-terminal.txt$')
  await KeyBoard.press('l')
  await KeyBoard.press('s')
  await KeyBoard.press('Enter')
  await expect(terminal).toContainText('persistent-terminal.txt')

  await Command.execute('Layout.hidePanel')
  await expect(terminal).toHaveCount(0)

  await Command.execute('Layout.showPanel', 'Terminals')
  const reopenedTerminal = Locator('.XtermTerminal')
  await expect(reopenedTerminal).toBeVisible()
  await reopenedTerminal.click()
  await expect(reopenedTerminal.locator('.xterm-helper-textarea')).toBeFocused()
  await expect(reopenedTerminal).toContainText('ls')
  await expect(reopenedTerminal).toContainText('persistent-terminal.txt')

  for (const character of 'exit') {
    await KeyBoard.press(character)
  }
  await KeyBoard.press('Enter')
  await expect(reopenedTerminal).toHaveCount(0)

  await Command.execute('Layout.hidePanel')
  await Command.execute('Layout.showPanel', 'Terminals')
  await expect(Locator('.XtermTerminal')).toBeVisible()
}
