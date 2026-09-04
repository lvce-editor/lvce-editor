import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-title-bar'

export const test: Test = async ({ Command, Editor, expect, Locator, Main }) => {
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'TitleBar')
  if (!component?.editable) {
    throw new Error(`Expected an editable TitleBar component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  await Editor.setText(`${JSON.stringify({ ...state, title: 'Live State Title' }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.title !== 'Live State Title') {
    throw new Error(`Expected TitleBar title to update, got ${updatedState.title}`)
  }
  await expect(Locator('.TitleBarTitle')).toHaveText('Live State Title')
}
