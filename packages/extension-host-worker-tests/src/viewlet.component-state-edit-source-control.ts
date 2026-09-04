import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-source-control'

export const test: Test = async ({ ActivityBar, Command, Editor, expect, Extension, FileSystem, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  const extensionUri = new URL('../fixtures/sample.source-control-save-badge', import.meta.url).toString().replace(/\/$/, '')
  await Extension.addWebExtension(extensionUri)
  await Extension.enableWorkspace('sample.source-control-save-badge')
  await ActivityBar.handleExtensionsChanged()
  const activationResult = await Command.execute('ExtensionManagement.activateByEvent', 'onSourceControl:memfs', '', 0)
  if (activationResult.error) {
    throw activationResult.error
  }
  await Command.execute('Layout.handleExtensionsChanged')
  await SideBar.open('Source Control')
  await expect(Locator('.SideBar textarea[name="SourceControlInput"]')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'Source Control')
  if (!component?.editable) {
    throw new Error(`Expected an editable Source Control component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  await Editor.setText(`${JSON.stringify({ ...state, inputSource: 2, inputValue: 'live state commit' }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.inputValue !== 'live state commit') {
    throw new Error(`Expected Source Control input value to update, got ${updatedState.inputValue}`)
  }
  await expect(Locator('.SideBar textarea[name="SourceControlInput"]')).toHaveValue('live state commit')
}
