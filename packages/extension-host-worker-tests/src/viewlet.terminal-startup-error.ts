import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-startup-error'

export const test: Test = async ({ Command, FileSystem, Locator, Settings, expect }) => {
  const directory = await FileSystem.getTmpDir({ scheme: 'file' })
  await Command.execute('Workspace.setUri', directory)
  await Settings.update({ 'terminal.backend': 'real' })
  await Command.execute('Layout.showPanel', 'Terminals')
  await expect(Locator('.XtermTerminal')).toBeVisible()
  await Command.execute('Terminals.addTerminal', `${directory}/missing-working-directory`)
  const terminal = Locator('.XtermTerminal')
  await expect(terminal).toBeVisible()
  await expect(terminal).toContainText('Create a new terminal to retry')
  await expect(Locator('.TerminalTabs')).toBeVisible()
}
