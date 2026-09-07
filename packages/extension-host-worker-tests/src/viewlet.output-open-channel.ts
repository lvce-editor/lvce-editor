import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.output-open-channel'

export const test: Test = async ({ Command, expect, Locator }) => {
  const select = Locator('[name="output"]')

  await Command.execute('Layout.openOutput', 'Window')
  await expect(select).toHaveValue('Window')

  await Command.execute('Layout.openOutput', 'SharedProcess')
  await expect(select).toHaveValue('SharedProcess')

  await Command.execute('Layout.hidePanel')
  await expect(select).toBeHidden()
  await Command.execute('Layout.openOutput', 'Window')
  await expect(select).toHaveValue('Window')
}
