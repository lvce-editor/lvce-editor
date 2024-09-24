export const name = 'viewlet.main-split-right'

export const test = async ({ QuickPick, FileSystem, Workspace, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await QuickPick.open()
  await QuickPick.setValue('>Split Right')

  // act
  await QuickPick.selectItem('Main: Split Right')

  // assert
  // TODO check that two editors are open now
}
