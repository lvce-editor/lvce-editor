import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly displayName: string
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-extension-names'

export const test: Test = async ({ ActivityBar, Command, Editor, expect, Extension, Locator }) => {
  await Extension.addWebExtension(new URL('../fixtures/sample.component-state-extension-names/', import.meta.url).href)
  await ActivityBar.handleExtensionsChanged()

  for (const title of ['Hetzner', 'Notes']) {
    const activityBarItem = Locator(`.ActivityBarItem[title="${title}"]`)
    await expect(activityBarItem).toBeVisible()
    await activityBarItem.click()

    await Command.execute('Developer.openComponentState')
    await expect(Locator('.ComponentStateView')).toBeVisible()

    const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
    const component = components.find((item) => item.displayName === `${title} (extension)`)
    if (!component || component.moduleId !== 'ExtensionView' || !component.editable) {
      throw new Error(`Expected an editable ${title} extension component, got ${JSON.stringify(components)}`)
    }

    const card = Locator(`.ComponentStateCard[data-uid="${component.uid}"]`)
    await expect(card.locator('.ComponentStateCardTitle')).toHaveText(`${title} (extension)`)
    await card.click()
    await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
    const state = JSON.parse(await Editor.getText())
    if (state.viewId !== `sample.component-state-${title.toLowerCase()}`) {
      throw new Error(`Expected the ${title} view state, got ${JSON.stringify(state)}`)
    }
  }
}
