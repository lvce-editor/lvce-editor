import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-status-bar'

export const test: Test = async ({ Command, Editor, expect, Locator, Main }) => {
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'StatusBar')
  if (!component?.editable) {
    throw new Error(`Expected an editable StatusBar component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  const statusBarItemsLeft = [
    {
      ariaLabel: 'Live component state',
      elements: [{ type: 'text', value: 'Live State' }],
      name: 'component.state.test',
      tooltip: 'Live component state',
    },
  ]
  await Editor.setText(`${JSON.stringify({ ...state, statusBarItemsLeft }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.statusBarItemsLeft[0]?.name !== 'component.state.test') {
    throw new Error(`Expected StatusBar items to update, got ${JSON.stringify(updatedState.statusBarItemsLeft)}`)
  }
  await expect(Locator('.StatusBarItem[name="component.state.test"]')).toHaveText('Live State')
}
