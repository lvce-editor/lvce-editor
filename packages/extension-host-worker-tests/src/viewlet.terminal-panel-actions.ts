import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-panel-actions'

export const test: Test = async (api) => {
  await api.Settings.update({
    'terminal.backend': 'mock',
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
  await runCommand('echo first-terminal')
  await api.expect(terminals).toContainText('first-terminal')

  await api.Locator('.TitleBarTopLevelEntry[aria-label="More ..."]').click()
  await api.Locator('#Menu-0 .MenuItem', { hasText: 'Terminal' }).hover()
  await api.expect(api.Locator('#Menu-1')).toBeVisible()
  await api.Locator('#Menu-1 .MenuItem', { hasText: 'New Terminal' }).click()
  await api.expect(api.Locator('.TerminalTab')).toHaveCount(2)
  await api.expect(terminals).toHaveCount(1)
  await api.expect(terminals.locator('.xterm-helper-textarea')).toBeFocused()

  await api.Locator('#Panel .IconButton[title="New Terminal"]').click()
  await api.expect(api.Locator('.TerminalTab')).toHaveCount(3)
  await api.expect(terminals).toHaveCount(1)
  await runCommand('echo left-terminal')
  await api.expect(terminals).toContainText('left-terminal')

  await api.Locator('.TerminalTab').nth(0).click()
  await api.expect(terminals).toContainText('first-terminal')
  await api.expect(terminals.locator('.xterm-helper-textarea')).toBeFocused()

  await api.Locator('.TerminalTab').nth(2).click()
  await api.expect(terminals).toContainText('left-terminal')
  await api.expect(terminals.locator('.xterm-helper-textarea')).toBeFocused()

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
