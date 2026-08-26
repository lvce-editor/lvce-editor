import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-panel-persistence'

export const test: Test = async ({ Command, KeyBoard, Locator, Settings, expect }) => {
  await Settings.update({
    'terminal.backend': 'mock',
  })

  await Command.execute('Layout.showPanel', 'Terminals')
  const terminal = Locator('.XtermTerminal')
  await expect(terminal).toBeVisible()

  for (const character of 'touch persistent-terminal.txt') {
    await KeyBoard.press(character === ' ' ? 'Space' : character)
  }
  await KeyBoard.press('Enter')
  await KeyBoard.press('l')
  await KeyBoard.press('s')
  await KeyBoard.press('Enter')
  await expect(terminal).toContainText('persistent-terminal.txt')

  await Command.execute('Layout.hidePanel')
  await expect(terminal).toHaveCount(0)

  await Command.execute('Layout.showPanel', 'Terminals')
  const reopenedTerminal = Locator('.XtermTerminal')
  await expect(reopenedTerminal).toBeVisible()
  await expect(reopenedTerminal).toContainText('ls')
  await expect(reopenedTerminal).toContainText('persistent-terminal.txt')
}
