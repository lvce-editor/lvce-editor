import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-problems'

export const test: Test = async ({ Command, Editor, expect, Locator, Main }) => {
  await Command.execute('Layout.showPanel', 'Problems')
  const filter = Locator('.Panel .InputBox')
  await expect(filter).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'Problems')
  if (!component?.editable) {
    throw new Error(`Expected an editable Problems component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  await Editor.setText(`${JSON.stringify({ ...state, filterValue: 'live state filter', inputSource: 2 }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.filterValue !== 'live state filter') {
    throw new Error(`Expected Problems filter to update, got ${updatedState.filterValue}`)
  }
  await expect(filter).toHaveValue('live state filter')
}
