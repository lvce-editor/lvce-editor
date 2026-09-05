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
    const dom = await Command.execute('ComponentState.getDom', component.uid)
    if (!Array.isArray(dom) || dom.length === 0 || typeof dom[0].childCount !== 'number') {
      throw new Error(`Expected current virtual DOM for ${moduleId}, got ${JSON.stringify(dom)}`)
    }
  }
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSideBar', 'Explorer')
  await expect(Locator('.Explorer')).toBeVisible()
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
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  for (const moduleId of ['TitleBar', 'StatusBar']) {
    const component = components.find((item) => item.moduleId === moduleId)
    if (!component?.domAvailable) {
      throw new Error(`Expected DOM inspection for ${moduleId}, got ${JSON.stringify(components)}`)
    }
    const cardTitle = Locator(`.ComponentStateCard[data-uid="${component.uid}"] .ComponentStateCardTitle`)
    await cardTitle.click({ button: 'right' })
    await expect(Locator('.Menu')).toBeVisible()
    await Command.execute('Menu.selectItem', 'Show Dom')
    await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
    await expect(Locator('.Editor')).toContainText('childCount')
    const dom = JSON.parse(await Editor.getText())
    if (!Array.isArray(dom) || !dom.some((node) => node.className?.split(' ').includes(moduleId))) {
      throw new Error(`Expected ${moduleId} virtual DOM, got ${JSON.stringify(dom)}`)
    }
    const uri = `live-component-state:///dom/${component.uid}.json`
    const readonly = await Command.execute('FileSystem.isReadonly', uri)
    if (!readonly) {
      throw new Error('Component DOM files must be read-only')
    }
    const content = await FileSystem.readFile(uri)
    if (!content.endsWith('\n') || !content.includes('\n  {')) {
      throw new Error('Expected formatted virtual DOM JSON')
    }
  }
}
