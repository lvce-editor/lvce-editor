import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-extension-detail'

export const test: Test = async ({ Command, Editor, expect, ExtensionDetail, Locator, Main }) => {
  await ExtensionDetail.open('builtin.theme-atom-one-dark')
  await expect(Locator('.ExtensionDetailName')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'ExtensionDetail')
  if (!component?.editable) {
    throw new Error(`Expected an editable ExtensionDetail component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  await Editor.setText(`${JSON.stringify({ ...state, name: 'Live State Extension' }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.name !== 'Live State Extension') {
    throw new Error(`Expected ExtensionDetail name to update, got ${updatedState.name}`)
  }
  await ExtensionDetail.open('builtin.theme-atom-one-dark')
  await expect(Locator('.ExtensionDetailName')).toContainText('Live State Extension')
}
