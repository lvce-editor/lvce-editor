import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.extension-detail-canonical-uri'

export const test: Test = async ({ Command, expect, ExtensionDetail, ExtensionSearch, Locator, Main }) => {
  const extensionId = 'builtin.theme-atom-one-dark'
  const canonicalUri = `extension-detail:///${extensionId}`
  const assertDetail = async (): Promise<void> => {
    await expect(Locator('.ExtensionDetailName')).toHaveText('Atom One Dark Themebuiltin')
    const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
    const component = components.find((item) => item.moduleId === 'ExtensionDetail')
    if (!component) {
      throw new Error('Expected an ExtensionDetail component')
    }
    const state = await Command.execute('ComponentState.getState', component.uid)
    if (state.uri !== canonicalUri) {
      throw new Error(`Expected ${canonicalUri}, got ${state.uri}`)
    }
  }

  await ExtensionDetail.open(extensionId)
  await assertDetail()
  await Main.closeAllEditors()

  await Main.openUri(canonicalUri)
  await assertDetail()
  await Main.closeAllEditors()

  await Main.openUri(`extension-detail://${extensionId}`)
  await assertDetail()
  await Main.closeAllEditors()

  await ExtensionSearch.open()
  await ExtensionSearch.handleInput('atom one dark')
  const item = Locator('.ExtensionListItem').first()
  await expect(item).toBeVisible()
  await expect(item.locator('.ExtensionListItemName')).toHaveText('Atom One Dark Theme')
  await ExtensionSearch.handleClick(0)
  await assertDetail()
}
