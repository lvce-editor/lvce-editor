import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.settings-side-bar-location'

export const test: Test = async ({ Command, expect, Locator, Main, Settings, SettingsView }) => {
  await SettingsView.show()
  await SettingsView.handleInput('side bar location')

  const sideBarLocation = Locator('select[name="workbench.sideBarLocation"]')
  const options = sideBarLocation.locator('option')
  await expect(sideBarLocation).toBeVisible()
  await expect(options).toHaveCount(2)
  await expect(options.nth(0)).toHaveText('Left')
  await expect(options.nth(1)).toHaveText('Right')
  await expect(sideBarLocation).toHaveValue('right')

  await Command.execute('Settings.handleSettingSelect', 'workbench.sideBarLocation', 'left')
  await expect(sideBarLocation).toHaveValue('left')
  await Settings.update({ 'workbench.sideBarLocation': 'left' })
  if ((await Command.execute('Preferences.get', 'workbench.sideBarLocation')) !== 'left') {
    throw new Error('Selecting left must persist the sidebar location')
  }

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.handleInput('side bar location')
  await expect(Locator('select[name="workbench.sideBarLocation"]')).toHaveValue('left')
}
