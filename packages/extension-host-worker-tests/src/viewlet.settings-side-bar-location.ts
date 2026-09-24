import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.settings-side-bar-location'

export const skip = 1 // Requires the settings-view enum value update to be released.

export const test: Test = async ({ Command, expect, KeyBoard, Locator, Main, SettingsView }) => {
  await SettingsView.show()
  await SettingsView.handleInput('side bar location')

  const sideBarLocation = Locator('select[name="workbench.sideBarLocation"]')
  const options = sideBarLocation.locator('option')
  await expect(sideBarLocation).toBeVisible()
  await expect(options).toHaveCount(2)
  await expect(options.nth(0)).toHaveText('Left')
  await expect(options.nth(1)).toHaveText('Right')
  await expect(sideBarLocation).toHaveValue('right')

  await sideBarLocation.click()
  await KeyBoard.press('ArrowUp')
  await expect(sideBarLocation).toHaveValue('left')
  if ((await Command.execute('Preferences.get', 'workbench.sideBarLocation')) !== 'left') {
    throw new Error('Selecting left must persist the sidebar location')
  }

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.handleInput('side bar location')
  await expect(Locator('select[name="workbench.sideBarLocation"]')).toHaveValue('left')
}
