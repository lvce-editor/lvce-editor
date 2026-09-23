import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-split-hierarchy'

export const test: Test = async ({ Command, ComponentState, Locator, Settings, expect }) => {
  await Settings.update({ 'terminal.backend': 'mock', 'terminal.tabs.enabled': true })
  await Command.execute('Layout.showPanel', 'Terminals')
  const panes = Locator('.XtermTerminal')
  const rows = Locator('.TerminalTab')
  const selected = Locator('.TerminalTabSelected')
  const { uid } = await ComponentState.getComponent('Terminals')

  // Exercise every removal position and collapse back to a single terminal.
  for (const removedIndex of [0, 1, 2]) {
    await expect(panes).toHaveCount(1)
    await expect(Locator('.TerminalTabs')).toHaveCount(1)
    await Command.execute('Terminals.splitTerminal')
    await expect(panes).toHaveCount(2)
    await expect(rows).toHaveCount(2)
    await expect(rows.nth(0)).toHaveClass('TerminalTabSplitFirst')
    await expect(rows.nth(1)).toHaveClass('TerminalTabSplitLast')
    await Command.execute('Terminals.splitTerminal')
    await expect(panes).toHaveCount(3)
    await expect(rows).toHaveCount(3)
    await expect(rows.nth(1)).toHaveClass('TerminalTabSplitMiddle')

    for (let i = 0; i < 3; i++) {
      await rows.nth(i).click()
      await expect(panes.nth(i).locator('.xterm-helper-textarea')).toBeFocused()
      await expect(rows.nth(i)).toHaveClass('TerminalTabSelected')
    }
    await panes.nth(0).click()
    await expect(rows.nth(0)).toHaveClass('TerminalTabSelected')
    await expect(selected).toHaveCount(1)

    await Command.execute('Viewlet.focusSelector', uid, `.TerminalTab:nth-child(${removedIndex + 1}) .TerminalTabKill`)
    await rows.nth(removedIndex).locator('.TerminalTabKill').click()
    await expect(panes).toHaveCount(2)
    await expect(rows).toHaveCount(2)
    await expect(rows.nth(0)).toHaveClass('TerminalTabSplitFirst')
    await expect(rows.nth(1)).toHaveClass('TerminalTabSplitLast')
    await expect(Locator('.TerminalTabSplitMiddle')).toHaveCount(0)

    // Use the same notification path as a terminal process exiting.
    const components = await ComponentState.getComponents()
    const terminal = components.find((component) => component.moduleId === 'Terminal2')
    if (!terminal) throw new Error('Missing terminal component')
    await Command.execute('Terminals.handleTerminalExit', terminal.uid)
    await expect(panes).toHaveCount(1)
    await expect(Locator('.TerminalTabs')).toHaveCount(1)
    await expect(panes.locator('.xterm-helper-textarea')).toBeFocused()
  }

  await Command.execute('Terminals.splitTerminal')
  await Command.execute('Terminals.addTerminal')
  await expect(rows).toHaveCount(3)
  await expect(panes).toHaveCount(1)
  await expect(rows.nth(2)).toHaveClass('TerminalTabGroupStart')
  await expect(Locator('.TerminalTabSplit')).toHaveCount(2)
  await rows.nth(1).click()
  await expect(panes).toHaveCount(2)
  await expect(panes.nth(1).locator('.xterm-helper-textarea')).toBeFocused()
  await expect(rows.nth(1)).toHaveClass('TerminalTabSelected')
}
