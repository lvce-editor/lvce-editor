import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly domAvailable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-show-dom'

export const test: Test = async ({ Command, Editor, expect, ExtensionDetail, ExtensionSearch, FileSystem, Locator, Workspace }) => {
  const checkDom = async (moduleId: string): Promise<void> => {
    const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
    const component = components.find((item) => item.moduleId === moduleId)
    if (!component?.domAvailable) {
      throw new Error(`Expected a DOM API for ${moduleId}`)
    }
    const cardTitle = Locator(`.ComponentStateCard[data-uid="${component.uid}"] .ComponentStateCardTitle`)
    await expect(cardTitle).toBeVisible()
    // Dispatch the menu event directly: the test runner's right-click helper also emits a normal click.
    await cardTitle.dispatchEvent('contextmenu', { bubbles: true, button: 2, cancelable: true, clientX: 100, clientY: 100 } as unknown as string)
    await expect(Locator('.Menu')).toBeVisible()
    const showDom = Locator('.Menu .MenuItem', { hasText: 'Show Dom' })
    await expect(showDom).toHaveCount(1)
    await expect(showDom).toHaveAttribute('aria-disabled', null)
    await showDom.click()
    await expect(Locator('.Menu')).toBeHidden()
    await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
    await expect(Locator('.Editor')).toContainText('childCount')
    const dom = JSON.parse(await Editor.getText())
    if (!Array.isArray(dom) || !dom.some((node) => node.className?.split(' ').includes(moduleId))) {
      throw new Error(`Expected ${moduleId} virtual DOM, got ${JSON.stringify(dom)}`)
    }
    const uri = `live-component-state:///dom/${component.uid}.json`
    const content = await FileSystem.readFile(uri)
    if (!content.endsWith('\n') || !content.includes('\n  {')) {
      throw new Error('Expected formatted virtual DOM JSON')
    }
  }
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSideBar', 'Explorer')
  await expect(Locator('.Explorer')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  await checkDom('Explorer')
  await Command.execute('Layout.showSideBar', 'Search')
  await expect(Locator('.Search')).toBeVisible()
  await checkDom('Search')
  await ExtensionSearch.open()
  await checkDom('Extensions')
  await ExtensionDetail.open('builtin.theme-atom-one-dark')
  await expect(Locator('.ExtensionDetail')).toBeVisible()
  await checkDom('ExtensionDetail')
  await checkDom('Main')
  await checkDom('TitleBar')
  await checkDom('StatusBar')
}
