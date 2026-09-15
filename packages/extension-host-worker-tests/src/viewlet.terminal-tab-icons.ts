import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-tab-icons'

export const test: Test = async ({ Command, Locator, Settings, expect }) => {
  await Settings.update({
    'terminal.backend': 'mock',
  })
  await Command.execute('Layout.showPanel', 'Terminals')
  await expect(Locator('.XtermTerminal')).toBeVisible()
  await Command.execute('Terminals.addTerminal')
  await expect(Locator('.TerminalTab')).toHaveCount(2)
  const bashIconUrl = /^url\("https?:\/\/[^/]+\/icons\/terminal-bash\.svg"\)$/
  for (let i = 0; i < 2; i++) {
    const tab = Locator('.TerminalTab').nth(i)
    await expect(tab.locator('.TerminalTabLabel')).toHaveText('bash')
    await expect(tab.locator('.TerminalTabIcon')).toBeVisible()
    await expect(tab.locator('.TerminalTabIcon')).toHaveCSS('mask-image', bashIconUrl as unknown as string)
  }
}
