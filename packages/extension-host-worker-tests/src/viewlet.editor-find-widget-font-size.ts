import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-find-widget-font-size'

export const test: Test = async ({ Editor, FileSystem, FindWidget, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(file, 'content 1\ncontent 2')
  await Settings.update({ 'editor.findWidgetFontSize': 30 })
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)

  await Editor.openFindWidget()

  const findWidget = Locator('.FindWidget')
  const findInput = Locator('.FindWidget .MultilineInputBox').nth(0)
  await expect(findWidget).toBeVisible()
  await expect(findWidget).toHaveCSS('font-size', '30px')
  await expect(findInput).toHaveCSS('height', /^(?:3[0-9]|[4-9][0-9]|[1-9][0-9]{2,})(?:\.\d+)?px$/ as unknown as string)

  await Settings.update({ 'editor.findWidgetFontSize': 50 })
  await expect(findWidget).toHaveCSS('font-size', '50px')
  await expect(findInput).toHaveCSS('height', /^(?:5[0-9]|[6-9][0-9]|[1-9][0-9]{2,})(?:\.\d+)?px$/ as unknown as string)

  await FindWidget.toggleReplace()
  const replaceInput = Locator('.FindWidget .MultilineInputBox').nth(1)
  await expect(replaceInput).toHaveCSS('font-size', '50px')
  await expect(replaceInput).toHaveCSS('height', /^(?:5[0-9]|[6-9][0-9]|[1-9][0-9]{2,})(?:\.\d+)?px$/ as unknown as string)

  await Settings.update({ 'editor.findWidgetFontSize': 0 })
  await expect(findWidget).toHaveCSS('font-size', '13px')
}
