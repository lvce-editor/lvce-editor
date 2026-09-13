import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-detail-sidebar-resize'

export const test: Test = async ({ Command, expect, ExtensionDetail, Locator }) => {
  await Command.execute('Layout.handleResize', 1200, 720)
  await ExtensionDetail.open('builtin.theme-atom-one-dark')
  const aside = Locator('.ExtensionDetail .Aside')
  await expect(aside).toBeVisible()

  await Command.execute('Layout.handleResize', 600, 720)
  await expect(aside).toHaveCount(0)

  await Command.execute('Layout.handleResize', 1200, 720)
  await expect(aside).toBeVisible()
}
