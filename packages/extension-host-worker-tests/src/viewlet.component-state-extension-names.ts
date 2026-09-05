import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly displayName: string
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-extension-names'

const waitForComponent = async (Command, title: string): Promise<ComponentInfo> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
    const component = components.find((item) => item.displayName === `${title} (extension)`)
    if (component?.moduleId === 'ExtensionView' && component.editable) {
      return component
    }
    if (attempt === 99) {
      throw new Error(`Expected an editable ${title} extension component, got ${JSON.stringify(components)}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error(`Extension component ${title} did not load`)
}

export const test: Test = async ({ ActivityBar, Command, Editor, expect, Extension, Locator }) => {
  await Extension.addWebExtension(new URL('../fixtures/sample.component-state-extension-names/', import.meta.url).href)
  await ActivityBar.handleExtensionsChanged()

  for (const title of ['Hetzner', 'Notes']) {
    const activityBarItem = Locator(`.ActivityBarItem[title="${title}"]`)
    await expect(activityBarItem).toBeVisible()
    await activityBarItem.click()
    const component = await waitForComponent(Command, title)

    await Command.execute('Developer.openComponentState')
    await expect(Locator('.ComponentStateView')).toBeVisible()
    await Locator('.ComponentStateView button[aria-label="Refresh"]').click()

    const card = Locator(`.ComponentStateCard[data-uid="${component.uid}"]`)
    await expect(card).toBeVisible()
    await expect(card.locator('.ComponentStateCardTitle')).toHaveText(`${title} (extension)`)
    await card.click()
    await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
    const state = JSON.parse(await Editor.getText())
    if (state.viewId !== `sample.component-state-${title.toLowerCase()}`) {
      throw new Error(`Expected the ${title} view state, got ${JSON.stringify(state)}`)
    }
  }
}
