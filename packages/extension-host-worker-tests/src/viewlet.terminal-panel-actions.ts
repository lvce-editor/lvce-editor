import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-panel-actions'

export const test: Test = async (api) => {
  await api.Settings.update({
    'terminal.backend': 'mock',
    'terminal.tabs.enabled': true,
  })

  const runCommand = async (command: string): Promise<void> => {
    for (const char of command) {
      await api.KeyBoard.press(char === ' ' ? 'Space' : char)
    }
    await api.KeyBoard.press('Enter')
  }

  await api.Command.execute('Layout.showPanel', 'Problems')
  await api.Locator('.PanelTab[name="Terminals"]').click()
  const terminals = api.Locator('.XtermTerminal')
  await api.expect(terminals).toHaveCount(1)
  await api.expect(terminals.locator('.xterm-helper-textarea')).toBeFocused()

  await api.Locator('#Panel .IconButton[title="New Terminal"]').click()
  await api.expect(api.Locator('.TerminalTab')).toHaveCount(2)
  await api.expect(terminals).toHaveCount(1)
  await runCommand('echo left-terminal')
  await api.expect(terminals).toContainText('left-terminal')

  await api.Locator('#Panel .IconButton[title="Split Terminal"]').click()
  await api.expect(terminals).toHaveCount(2)
  await runCommand('echo right-terminal')
  await api.expect(terminals.nth(1)).toContainText('right-terminal')

  await terminals.nth(0).click()
  await api.expect(terminals.nth(0).locator('.xterm-helper-textarea')).toBeFocused()
  await api.Locator('#Panel .IconButton[title="Kill Terminal"]').click()
  await api.expect(terminals).toHaveCount(1)
  await api.expect(terminals).toContainText('right-terminal')
}
