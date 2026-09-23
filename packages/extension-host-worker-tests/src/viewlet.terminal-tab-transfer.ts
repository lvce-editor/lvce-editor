import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-tab-transfer'

export const test: Test = async (api) => {
  const { Command, ComponentState, KeyBoard, Locator, Settings, expect } = api
  const { DragAndDrop } = api as any
  await Settings.update({ 'terminal.backend': 'mock', 'terminal.tabs.enabled': true })
  await Command.execute('Layout.showPanel', 'Terminals')
  const panelTerminal = Locator('.Terminals .XtermTerminal')
  await expect(panelTerminal).toBeVisible()
  await panelTerminal.click()
  const run = async (text: string): Promise<void> => {
    for (const character of text) {
      await KeyBoard.press(character === ' ' ? 'Space' : character)
    }
    await KeyBoard.press('Enter')
  }
  await run('touch round-trip.txt')
  await run('ls')
  await expect(panelTerminal).toContainText('round-trip.txt')
  const panel = await ComponentState.getComponent('Terminals')
  const components = await ComponentState.getComponents()
  const terminal = components.find((component) => component.moduleId === 'Terminal2')
  if (!terminal) throw new Error('Missing terminal component')
  const payload = {
    type: 'application/x-lvce-terminal',
    data: `lvce-terminal:${JSON.stringify({ sourceUid: panel.uid, terminalUid: terminal.uid })}`,
  }

  // The real pointer listener must prepare the terminal-only drag payload.
  await Locator('.TerminalTab').dispatchEvent('pointerdown', { bubbles: true, button: 0 } as any)
  await DragAndDrop.shouldHaveDragData([payload])
  await Command.execute('Terminals.handleDragEnd')
  await expect(panelTerminal).toBeVisible()
  await Command.execute('Terminals.handleTabPointerDown', String(terminal.uid))
  await Command.execute('Layout.showSideBar', 'Explorer')
  const rejectedDrop = await DragAndDrop.createDropSessionFromDragData()
  const explorer = await ComponentState.getComponent('Explorer')
  const explorerState = await Command.execute('ComponentState.getState', explorer.uid)
  await Command.execute('Explorer.handleDrop', explorerState.x + 10, explorerState.y + explorerState.height - 10, rejectedDrop)
  await expect(panelTerminal).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(0)
  await Command.execute('Terminals.handleTabPointerDown', String(terminal.uid))
  const dropId = await DragAndDrop.createDropSessionFromDragData()
  await Command.execute('Main.handleDrop', dropId)
  await expect(panelTerminal).toHaveCount(0)
  await expect(Locator('.TerminalTab')).toHaveCount(0)
  const mainTerminal = Locator('.Main .XtermTerminal')
  await expect(mainTerminal).toBeVisible()
  await expect(mainTerminal).toContainText('round-trip.txt')
  await mainTerminal.click()
  await run('ls')
  await expect(mainTerminal).toContainText('round-trip.txt')

  await Command.execute('Main.handleClickTab', '0', '0', 0)
  const returnDrop = await DragAndDrop.createDropSessionFromDragData()
  await Command.execute('Terminals.handleDrop', returnDrop)
  await expect(mainTerminal).toHaveCount(0)
  await expect(Locator('.MainTab')).toHaveCount(0)
  await expect(panelTerminal).toBeVisible()
  await expect(panelTerminal).toContainText('round-trip.txt')
  const after = (await ComponentState.getComponents()).filter((component) => component.moduleId === 'Terminal2')
  if (after.length !== 1 || after[0].uid !== terminal.uid) throw new Error('Terminal session was replaced or duplicated')
  await panelTerminal.click()
  await run('exit')
  await expect(Locator('.XtermTerminal')).toHaveCount(0)

  // Moving one split leaves the other split and unrelated terminals owned by the panel.
  await Command.execute('Terminals.addTerminal')
  await Command.execute('Terminals.splitTerminal')
  await Command.execute('Terminals.addTerminal')
  await Command.execute('Terminals.handleClickTab', '0')
  const splitTerminals = (await ComponentState.getComponents()).filter((component) => component.moduleId === 'Terminal2')
  const splitUid = Math.min(...splitTerminals.map((component) => component.uid))
  await Command.execute('Terminals.handleTabPointerDown', String(splitUid))
  await Command.execute('Main.handleDrop', await DragAndDrop.createDropSessionFromDragData())
  await expect(Locator('.TerminalTab')).toHaveCount(2)
  await expect(panelTerminal).toHaveCount(1)
  await expect(mainTerminal).toHaveCount(1)
  await Command.execute('Layout.hideSideBar')
  await expect(mainTerminal).toBeVisible()
  await Command.execute('Layout.showSideBar', 'Explorer')
  await expect(mainTerminal).toBeVisible()
  await Command.execute('Main.closeActiveEditor')
  await expect(mainTerminal).toHaveCount(0)
  await expect(Locator('.TerminalTab')).toHaveCount(2)
  await panelTerminal.click()
  await run('echo remaining-split')
  await expect(panelTerminal).toContainText('remaining-split')
}
