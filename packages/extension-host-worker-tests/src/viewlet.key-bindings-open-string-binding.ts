import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.key-bindings-open-string-binding'

export const test: Test = async ({ Command, expect, KeyBindingsEditor, Locator, Main }) => {
  await Command.execute(
    'FileSystem.writeFile',
    'app://keybindings.json',
    JSON.stringify([{ key: 'ctrl+shift+p', command: 'test.openKeyboardShortcutsWithStringKey' }]),
  )

  await KeyBindingsEditor.open()

  const keyBindingsTable = Locator('.Table')
  await expect(keyBindingsTable).toBeVisible()
  const rows = Locator('.TableBody .TableRow')
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('test.openKeyboardShortcutsWithStringKey')

  await KeyBindingsEditor.handleInput('test.openKeyboardShortcutsWithStringKey')
  await expect(rows).toHaveCount(1)

  await Main.closeAllEditors()
  await KeyBindingsEditor.open()
  await expect(Locator('.Table')).toBeVisible()
  await expect(Locator('.TableBody .TableRow')).toHaveCount(1)
  await expect(Locator('.TableBody .TableRow').first()).toContainText('test.openKeyboardShortcutsWithStringKey')
}
