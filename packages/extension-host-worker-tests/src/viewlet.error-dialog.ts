import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.error-dialog'

export const test: Test = async ({ Command, expect, Locator }) => {
  const message = 'DevContainerNode.cliUp failed with exit code 1'
  await Command.execute('Dialog.showMessage', { message, type: 'Error' })
  const dialog = Locator('.DialogContent')
  await expect(dialog).toBeVisible()
  await expect(Locator('.DialogErrorIcon')).toBeVisible()
  await expect(Locator('.DialogErrorIcon')).toHaveAttribute('aria-label', 'Error')
  await expect(Locator('.DialogHeading')).toHaveText('Error')
  await expect(Locator('.DialogMessage')).toHaveText(message)
  await Locator('.DialogClose').click()
  await expect(dialog).toHaveCount(0)
}
