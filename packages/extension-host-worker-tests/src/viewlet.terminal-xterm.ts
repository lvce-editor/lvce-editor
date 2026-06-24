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
    'terminal.renderer': 'xterm',
  })

  await Command.execute('Layout.showPanel', 'Terminals')
  await Command.execute('Panel.selectIndex', 3)

  const terminal = Locator('.XtermTerminal')
  await expect(terminal).toBeVisible()
  await terminal.click()

  await runCommand(KeyBoard, 'echo hello > file.txt')
  await runCommand(KeyBoard, 'cat file.txt')
  await expect(terminal).toContainText('hello')

  await runCommand(KeyBoard, 'touch created.txt')
  await runCommand(KeyBoard, 'ls')
  await expect(terminal).toContainText('created.txt')
}
