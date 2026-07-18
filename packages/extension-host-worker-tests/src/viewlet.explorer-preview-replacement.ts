export const name = 'viewlet.explorer-preview-replacement'

export const test = async ({ Editor, Explorer, FileSystem, Locator, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/first.txt`, 'first content')
  await FileSystem.writeFile(`${tmpDir}/second.txt`, 'second content')
  await Workspace.setPath(tmpDir)

  await Explorer.handleClick(0)
  await Editor.shouldHaveText('first content')

  await Explorer.handleClick(1)
  await Editor.shouldHaveText('second content')
  await expect(Locator('.EditorContainer > .Viewlet.Editor')).toHaveCount(1)
}
