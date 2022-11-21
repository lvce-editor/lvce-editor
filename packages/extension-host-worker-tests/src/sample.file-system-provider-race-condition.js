test('viewlet.file-system-provider-race-condition', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file-3.txt`, '')

  // act
  await Workspace.setPath(tmpDir)
  await Promise.all([
    Main.openUri(`${tmpDir}/file-1.txt`),
    Main.openUri(`${tmpDir}/file-2.txt`),
    Main.openUri(`${tmpDir}/file-3.txt`),
  ])

  // file 3 loads first

  // file 2 loads second

  // file 1 loads last
})
