import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-main-area'

const waitForLoadedState = async (Editor) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const state = JSON.parse(await Editor.getText())
      const activeGroup = state.layout.groups.find((group) => group.id === state.layout.activeGroupId)
      const activeTab = activeGroup?.tabs.find((tab) => tab.id === activeGroup.activeTabId)
      if (activeTab?.loadingState === 'loaded') {
        return state
      }
    } catch (error) {
      if (attempt === 99) {
        throw error
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error('Expected the Main component-state editor to finish loading')
}

export const test: Test = async ({ Command, Editor, expect, Locator, Main }) => {
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'Main')
  if (!component?.editable) {
    throw new Error(`Expected an editable Main component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = await waitForLoadedState(Editor)
  const dragOverlay = { height: 40, width: 80, x: 10, y: 10 }
  await Editor.setText(`${JSON.stringify({ ...state, dragOverlay }, null, 2)}\n`)
  await new Promise((resolve) => setTimeout(resolve, 250))
  if (!JSON.parse(await Editor.getText()).dragOverlay) {
    throw new Error('Live Main state editor was overwritten before save')
  }
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.dragOverlay?.width !== 80) {
    throw new Error(`Expected Main drag overlay to update, got ${JSON.stringify(updatedState.dragOverlay)}`)
  }
  if (updatedState.maxOpenEditorGroups !== Infinity || updatedState.maxOpenEditors !== Infinity) {
    throw new Error('Expected Main editor limits to survive the JSON round trip')
  }
  await expect(Locator('.Main .DragOverlay')).toBeVisible()
}
