import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-open-keybindings-json'

export const test: Test = async ({ Command, Editor, expect, Locator, Main, QuickPick }) => {
  const initialContent = '[\n  {\n    "key": "ctrl+shift+p",\n    "command": "workbench.action.quickOpen"\n  }\n]'
  const editedContent = ` ${initialContent}`
  await Command.execute('FileSystem.writeFile', 'app://keybindings.json', initialContent)

  await QuickPick.open()
  await QuickPick.setValue('>keyboard shortcuts')
  const command = Locator('.QuickPickItem', { hasText: 'Preferences: Open Keyboard Shortcuts (JSON)' })
  await expect(command).toBeVisible()
  await QuickPick.selectItem('Preferences: Open Keyboard Shortcuts (JSON)')

  const editor = Locator('.Editor')
  await expect(editor).toHaveText(initialContent.replaceAll('\n', ''))
  await Editor.setCursor(0, 0)
  await Editor.type(' ')
  await Main.save()

  await Main.closeAllEditors()
  await QuickPick.open()
  await QuickPick.setValue('>json')
  await QuickPick.selectItem('Preferences: Open Keyboard Shortcuts (JSON)')
  await expect(editor).toHaveText(editedContent.replaceAll('\n', ''))
}
