export const name = 'settings.hover-plaintext-description'

export const test = async ({ Editor, FileSystem, Main, Workspace, Locator, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const settingsPath = `${tmpDir}/settings.json`
  await FileSystem.writeFile(settingsPath, '{\n  "git.remoteHosts": {}\n}')
  await Workspace.setPath(tmpDir)
  await Main.openUri(settingsPath)

  await Editor.setCursor(1, 8)
  await Editor.openHover()

  const hover = Locator('.EditorHover')
  await expect(hover).toBeVisible()
  await expect(hover).toContainText('http://localhost:3001')
  await expect(hover.locator('a')).toHaveCount(0)
}
