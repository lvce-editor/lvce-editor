export const name = 'viewlet.explorer-rename-open-file-updates-tab-title'

export const test = async ({ Editor, expect, Explorer, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const originalUri = `${tmpDir}/original.txt`
  const renamedUri = `${tmpDir}/renamed.txt`
  await FileSystem.writeFile(originalUri, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.handleClick(0)

  const originalTab = Locator('.MainTab[title$="original.txt"]')
  const renamedTab = Locator('.MainTab[title$="renamed.txt"]')
  await expect(originalTab).toBeVisible()

  await Explorer.focusIndex(0)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('renamed.txt')
  await Explorer.acceptEdit()

  await expect(originalTab).toBeHidden()
  await expect(renamedTab).toBeVisible()

  await Editor.setCursor(0, 7)
  await Editor.type('Z')
  await Main.save()

  await FileSystem.shouldHaveFile(renamedUri, 'contentZ')
  const entries = await FileSystem.readDir(tmpDir)
  const names = entries.map((entry) => entry.name)
  if (names.length !== 1 || names[0] !== 'renamed.txt') {
    throw new Error(`Expected only renamed.txt after saving the renamed editor, got ${JSON.stringify(names)}`)
  }
}
