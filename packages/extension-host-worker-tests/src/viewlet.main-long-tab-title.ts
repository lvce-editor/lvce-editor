export const name = 'viewlet.main-long-tab-title'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect, SideBar }) => {
  // arrange
  await SideBar.hide()
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'this-is-a-very-long-file-name-that-does-not-fit-inside-the-editor-tab.txt'
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'content')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/${fileName}`)

  // assert
  const tab = Locator('.MainTab')
  await expect(tab).toHaveCount(1)
  await expect(tab).toHaveCSS('max-width', '200px')

  const fileIcon = tab.locator('.TabIcon')
  await expect(fileIcon).toHaveCSS('flex-shrink', '0')
  await expect(fileIcon).toHaveCSS('width', '16px')

  const title = tab.locator('.TabTitle')
  await expect(title).toHaveText(fileName)
  await expect(title).toHaveCSS('flex-grow', '1')
  await expect(title).toHaveCSS('flex-shrink', '1')
  await expect(title).toHaveCSS('min-width', '0px')
  await expect(title).toHaveCSS('overflow', 'hidden')
  await expect(title).toHaveCSS('text-overflow', 'ellipsis')
  await expect(title).toHaveCSS('white-space', 'nowrap')

  const closeButton = tab.locator('.EditorTabCloseButton')
  await expect(closeButton).toHaveCSS('flex-shrink', '0')
  await expect(closeButton).toHaveCSS('width', '23px')

  // act
  await closeButton.click()

  // assert
  await expect(tab).toHaveCount(0)
}
