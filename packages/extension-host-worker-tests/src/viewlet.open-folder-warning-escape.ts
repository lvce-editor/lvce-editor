import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.open-folder-warning-escape'

export const test: Test = async ({ expect, KeyBoard, Locator }) => {
  const dialog = Locator('.DialogContent')
  const confirm = Locator('[name="Confirm"]')
  const openFolder = async () => {
    await Locator('.TitleBarTopLevelEntry[name="File"]').click()
    await expect(Locator('.Menu')).toBeVisible()
    await expect(Locator('.MenuItem')).toHaveCount(9)
    await Locator('.MenuItem').nth(3).click()
    await expect(dialog).toBeVisible()
    await expect(Locator('.DialogHeading')).toHaveText('Opening Local Folders is Unsupported')
    await expect(confirm).toBeFocused()
  }

  await openFolder()
  await KeyBoard.press('Escape')
  await expect(dialog).toHaveCount(0)

  await openFolder()
  await Locator('.DialogClose').click()
  await expect(dialog).toHaveCount(0)
}
