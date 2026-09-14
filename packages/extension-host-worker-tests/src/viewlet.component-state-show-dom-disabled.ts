import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.component-state-show-dom-problems'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/context-menu.txt`
  await FileSystem.writeFile(uri, 'Keep this editor open')
  await Main.openUri(uri)
  await Command.execute('Layout.showPanel', 'Problems')
  await expect(Locator('.Problems')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const components = await Command.execute('ComponentState.getComponents')
  const component = components.find((item) => item.moduleId === 'Problems')
  if (!component?.editable || component.domAvailable !== true) {
    throw new Error('Expected Problems to support state and DOM inspection')
  }

  const card = Locator(`.ComponentStateCard[data-uid="${component.uid}"]`)
  await expect(card).toBeVisible()
  // Dispatch the menu event directly: the test runner's right-click helper also emits a normal click.
  await card.dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  } as unknown as string)
  const showDom = Locator('.Menu .MenuItem', { hasText: 'Show Dom' })
  await expect(showDom).toBeVisible()
  await expect(showDom).toHaveAttribute('aria-disabled', null)
  await showDom.click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('childCount')
  const dom = JSON.parse(await Editor.getText())
  if (!Array.isArray(dom) || !dom.some((node) => node.className?.split(' ').includes('Problems'))) {
    throw new Error('Expected Problems virtual DOM')
  }
  await KeyBoard.press('Escape')
  await expect(Locator('.Menu')).toBeHidden()
}
