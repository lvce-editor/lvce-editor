test('viewlet.main-tab-closed-before-loading', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file-3.txt`, '')

  // act
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file-1.txt`)
  Main.openUri(`${tmpDir}/file-2.txt`)
  await Main.closeCurrentTab()

  // TODO check that tab 2 has been closed and tab 1 is still visible
})
