export const name = 'viewlet.chat-full-screen-layout'

export const test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)

  const chatView = Locator('.Viewlet.Chat')
  const activityBar = Locator('.ActivityBar')
  const titleBarMenuBar = Locator('.TitleBarMenuBar')

  await expect(chatView).toBeHidden()
  await expect(activityBar).toBeVisible()
  await expect(titleBarMenuBar).toBeVisible()

  await QuickPick.open()
  await QuickPick.setValue('>Layout: Enter Chat Full Screen')
  await QuickPick.selectItem('Layout: Enter Chat Full Screen')

  await expect(chatView).toBeVisible()
  await expect(activityBar).toBeHidden()
  await expect(titleBarMenuBar).toBeHidden()

  await QuickPick.open()
  await QuickPick.setValue('>Layout: Leave Chat Full Screen')
  await QuickPick.selectItem('Layout: Leave Chat Full Screen')

  await expect(chatView).toBeHidden()
  await expect(activityBar).toBeVisible()
  await expect(titleBarMenuBar).toBeVisible()
}
