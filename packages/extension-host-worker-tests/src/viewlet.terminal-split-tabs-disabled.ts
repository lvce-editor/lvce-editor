import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-split-tabs-disabled'

export const test: Test = async ({ Command, Locator, Settings, expect }) => {
  await Settings.update({ 'terminal.backend': 'mock', 'terminal.tabs.enabled': false })
  await Command.execute('Layout.showPanel', 'Terminals')
  await Command.execute('Terminals.splitTerminal')
  await expect(Locator('.XtermTerminal')).toHaveCount(2)
  await expect(Locator('.TerminalTabs')).toHaveCount(0)
  await Command.execute('Terminals.addTerminal')
  await expect(Locator('.XtermTerminal')).toHaveCount(1)
  await expect(Locator('.TerminalTabs')).toHaveCount(0)
}
