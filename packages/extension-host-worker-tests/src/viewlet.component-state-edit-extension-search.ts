import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-extension-search'

export const test: Test = async ({ Command, Editor, expect, ExtensionSearch, Locator, Main }) => {
  await ExtensionSearch.open()
  await expect(Locator('.Extensions [name="extensions"]')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'Extensions')
  if (!component?.editable) {
    throw new Error(`Expected an editable Extensions component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  await Editor.setText(`${JSON.stringify({ ...state, inputSource: 2, searchValue: '@disabled' }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.searchValue !== '@disabled') {
    throw new Error(`Expected Extensions search value to update, got ${updatedState.searchValue}`)
  }
  await expect(Locator('.Extensions [name="extensions"]')).toHaveValue('@disabled')
}
