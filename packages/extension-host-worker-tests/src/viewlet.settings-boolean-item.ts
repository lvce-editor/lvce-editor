import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.settings-boolean-item'

export const test: Test = async ({ Command, expect, Locator, Settings, SettingsView }) => {
  await Settings.update({
    'editor.cache': false,
    'editor.semanticTokens': false,
    'files.workspaceWatcher.enabled': false,
    'languages.jsFilesAsJsx': false,
    'settings.useToggles': true,
  })
  await SettingsView.show()
  await expect(Locator('.Settings')).toBeVisible()

  await expect(Locator('.SettingsItem').nth(0)).toBeVisible()
  await SettingsView.selectTab('text-editor')
  const setting = Locator('.SettingsItem:has(input[type="checkbox"])').nth(0)
  const input = setting.locator('input[type="checkbox"]')
  const label = setting.locator('.Label')
  await expect(input).toHaveCount(1)
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('type', 'checkbox')
  await expect(input).toHaveClass('Toggle')
  await expect(input).toHaveJSProperty('checked', false)

  // eslint-disable-next-line @typescript-eslint/no-deprecated -- verify clicking the associated text toggles the control
  await label.click()
  await expect(input).toHaveJSProperty('checked', true)

  await Command.execute('Settings.handleSettingChecked', 'settings.useToggles', false)
  await expect(input).toHaveClass('CheckBox')

  // eslint-disable-next-line @typescript-eslint/no-deprecated -- verify checkbox text interaction remains supported
  await label.click()
  await expect(input).toHaveJSProperty('checked', false)

  await Command.execute('Settings.handleSettingChecked', 'settings.useToggles', true)
  await expect(input).toHaveClass('Toggle')
}
