import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.component-state-show-dom-dismiss'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/context-menu.txt`
  await FileSystem.writeFile(uri, 'Keep this editor open')
  await Main.openUri(uri)
  await Command.execute('Developer.openComponentState')
  const components = await Command.execute('ComponentState.getComponents')
  const titleBar = components.find((item) => item.moduleId === 'TitleBar')
  const statusBar = components.find((item) => item.moduleId === 'StatusBar')
  if (!titleBar?.domAvailable || !statusBar?.domAvailable) {
    throw new Error('Expected TitleBar and StatusBar DOM inspection')
  }

  const titleBarLabel = Locator(`.ComponentStateCard[data-uid="${titleBar.uid}"] .ComponentStateCardTitle`)
  await expect(titleBarLabel).toBeVisible()
  // Dispatch the menu event directly: the test runner's right-click helper also emits a normal click.
  await titleBarLabel.dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  } as unknown as string)
  await expect(Locator('.Menu .MenuItem', { hasText: 'Show Dom' })).toBeVisible()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText('context-menu.txt')
  await KeyBoard.press('Escape')
  await expect(Locator('.Menu')).toBeHidden()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText('context-menu.txt')

  const statusBarLabel = Locator(`.ComponentStateCard[data-uid="${statusBar.uid}"] .ComponentStateCardStatus`)
  await expect(statusBarLabel).toBeVisible()
  await statusBarLabel.dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  } as unknown as string)
  const showDom = Locator('.Menu .MenuItem', { hasText: 'Show Dom' })
  await expect(showDom).toBeVisible()
  await showDom.click()
  await expect(Locator('.Menu')).toBeHidden()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${statusBar.uid}.json`)
  const dom = JSON.parse(await Editor.getText())
  if (!Array.isArray(dom) || !dom.some((node) => node.className?.split(' ').includes('StatusBar'))) {
    throw new Error('Expected StatusBar DOM after reopening the menu on its card')
  }
}
