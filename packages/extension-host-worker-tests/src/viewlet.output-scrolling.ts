import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.output-scrolling'

export const test: Test = async ({ Command, expect, Extension, FileSystem, KeyBoard, Locator, Output, Panel }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.writeFile(`${tmpDir}/test.txt`, '')
  const extensionUri = import.meta.resolve('../fixtures/viewlet.output-scrolling')
  await Extension.addWebExtension(extensionUri)
  await Panel.open('Output')
  await Command.execute('Panel.selectIndex', 1)
  await Output.selectChannel('scrolling')

  const outputContent = Locator('.OutputContent')
  const lines = Locator('.OutputContent .Line')
  const firstLine = lines.nth(0)
  const lastLine = lines.nth(99)
  await expect(outputContent).toHaveCSS('overflow-x', 'auto')
  await expect(outputContent).toHaveCSS('overflow-y', 'auto')
  await expect(firstLine).toBeVisible()
  await expect(lastLine).not.toBeVisible()

  await outputContent.click()
  await expect(outputContent).toBeFocused()
  await KeyBoard.press('End')

  await expect(lastLine).toBeVisible()
}
