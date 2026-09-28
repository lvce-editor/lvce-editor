import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.key-bindings-open-string-binding'

export const test: Test = async ({ Command, expect, KeyBindingsEditor, Locator, Main }) => {
  await Command.execute(
    'FileSystem.writeFile',
    'app://keybindings.json',
    JSON.stringify([{ key: 'ctrl+shift+p', command: 'test.openKeyboardShortcutsWithStringKey' }, { key: 'ctrl+shift+8' }, 'invalid keybinding']),
  )
  await KeyBindingsEditor.open()

  const keyBindingsTable = Locator('.Table')
  await expect(keyBindingsTable).toBeVisible()
  const rows = Locator('.TableBody .TableRow')
  await KeyBindingsEditor.handleInput('undefined')
  await expect(rows).toHaveCount(0)
  await KeyBindingsEditor.handleInput('test.openKeyboardShortcutsWithStringKey')
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('test.openKeyboardShortcutsWithStringKey')
  await KeyBindingsEditor.handleInput('Chat.handleClickNew')
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('Chat.handleClickNew')

  await KeyBindingsEditor.handleInput('test.openKeyboardShortcutsWithStringKey')
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('test.openKeyboardShortcutsWithStringKey')

  await KeyBindingsEditor.handleInput('test.openKeyboardShortcutsWithStringKey')
  await expect(rows).toHaveCount(1)

  await Main.closeAllEditors()
  await KeyBindingsEditor.open()
  await expect(Locator('.Table')).toBeVisible()
  await KeyBindingsEditor.handleInput('test.openKeyboardShortcutsWithStringKey')
  await expect(Locator('.TableBody .TableRow')).toHaveCount(1)
  await expect(Locator('.TableBody .TableRow').first()).toContainText('test.openKeyboardShortcutsWithStringKey')
  await KeyBindingsEditor.handleInput('Chat.handleClickNew')
  await expect(Locator('.TableBody .TableRow')).toHaveCount(1)
  await expect(Locator('.TableBody .TableRow').first()).toContainText('Chat.handleClickNew')
}
