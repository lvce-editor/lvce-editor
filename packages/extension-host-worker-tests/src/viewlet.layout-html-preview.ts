import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.layout-html-preview'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const first = `${tmpDir}/index # %.html`
  const second = `${tmpDir}/second.html`
  await FileSystem.writeFile(`${tmpDir}/theme.css`, '#message { color: rgb(255, 0, 0); }')
  await FileSystem.writeFile(first, '<link rel="stylesheet" href="./theme.css"><p id="message">hello world</p>')
  await FileSystem.writeFile(second, '<p id="second">second preview</p>')
  await Main.openUri(first)
  await Command.execute('Layout.showPreview', first)
  const preview = Locator('.SimpleBrowser .Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#message')).toHaveText('hello world')
  await expect(preview.locator('#message')).toHaveCSS('color', 'rgb(255, 0, 0)')
  await expect(Locator('.SimpleBrowser input[name="simple-browser-address"]')).toHaveValue(`html-preview:///${encodeURIComponent(first)}`)
  await expect(Locator('.Viewlet.Preview')).toHaveCount(1)
  await Command.execute('Layout.showPreview', second)
  await expect(Locator('.SimpleBrowserTab')).toHaveCount(2)
  await expect(preview.locator('#second')).toHaveText('second preview')
  await Command.execute('SimpleBrowser.closeTab', 1)
  await expect(preview.locator('#message')).toHaveText('hello world')
  await Editor.setText('<p id="message">updated preview</p>')
  await expect(preview.locator('#message')).toHaveText('updated preview')
  await Command.execute('SimpleBrowser.reload')
  await expect(preview.locator('#message')).toBeVisible()
}
