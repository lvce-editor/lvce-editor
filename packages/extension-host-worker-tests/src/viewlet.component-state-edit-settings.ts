import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-settings'

export const test: Test = async ({ Command, Editor, expect, KeyBoard, Locator, Main }) => {
  await Command.execute('Preferences.openSettingsUi')
  await expect(Locator('.Settings')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'Settings')
  if (!component?.editable) {
    throw new Error(`Expected an editable Settings component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  const { id } = state
  if (id !== component.uid) {
    throw new Error(`Expected Settings state id ${component.uid}, got ${id}`)
  }

  await Editor.setText(`${JSON.stringify({ ...state, searchValue: 'editor' }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.searchValue !== 'editor') {
    throw new Error(`Expected Settings search value to update, got ${updatedState.searchValue}`)
  }
  await Command.execute('Preferences.openSettingsUi')
  await expect(Locator('.Settings')).toBeVisible()
  await expect(Locator('.SettingsSearchInput')).toBeVisible()
  await expect(Locator('[name="SettingsSearch"]')).toHaveValue('editor')
  const searchInput = Locator('[name="SettingsSearch"]')
  await searchInput.click()
  await KeyBoard.press('Control+A')
  await searchInput.type('font')
  const refreshedState = await Command.execute('ComponentState.getState', component.uid)
  if (refreshedState.searchValue !== 'font') {
    throw new Error(`Expected Settings state to refresh after UI interaction, got ${refreshedState.searchValue}`)
  }
}
