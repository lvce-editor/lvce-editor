import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-text-search'

export const test: Test = async ({ Command, Editor, expect, Locator, Main, SideBar }) => {
  await SideBar.open('Search')
  await expect(Locator('.SideBar textarea[name="SearchValue"]')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'Search')
  if (!component?.editable) {
    throw new Error(`Expected an editable Search component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  await Editor.setText(`${JSON.stringify({ ...state, inputSource: 2, value: 'live state query' }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.value !== 'live state query') {
    throw new Error(`Expected Search value to update, got ${updatedState.value}`)
  }
  await expect(Locator('.SideBar textarea[name="SearchValue"]')).toHaveValue('live state query')
}
