export const name = 'viewlet.terminal-xterm'

const typeText = async (KeyBoard, text) => {
  for (const char of text) {
    await KeyBoard.press(char === ' ' ? 'Space' : char)
  }
}

const runCommand = async (KeyBoard, command) => {
  await typeText(KeyBoard, command)
  await KeyBoard.press('Enter')
}

export const test = async ({ Command, KeyBoard, Locator, Settings, expect }) => {
  await Settings.update({
    'terminal.backend': 'mock',
  })

  await Command.execute('Layout.showPanel', 'Problems')
  const terminalsTab = Locator('.PanelTab[name="Terminals"]')
  await terminalsTab.click()

  const terminal = Locator('.XtermTerminal')
  await expect(terminal).toBeVisible()
  const terminalViewport = terminal.locator('.xterm-viewport')
  await expect(terminalViewport).toHaveCSS('scrollbar-color', 'rgba(57, 71, 71, 0.6) rgba(0, 0, 0, 0)')
  const terminalInput = terminal.locator('.xterm-helper-textarea')
  await expect(terminalInput).toBeFocused()

  await runCommand(KeyBoard, 'echo hello > file.txt')
  await runCommand(KeyBoard, 'cat file.txt')
  await expect(terminal).toContainText('hello')

  await runCommand(KeyBoard, 'touch created.txt')
  await runCommand(KeyBoard, 'ls')
  await expect(terminal).toContainText('created.txt')
}
